import { getRedisClient } from '../../redis/redis-client.js';
import { ticketStatus } from "../utils/ticketStatus.js";

const redisClient = getRedisClient();

export function extendLock(call, callback) {
    try {
        const start = Date.now();

        const { ticket, owner } = call.request;
        const { lifetime } = call.request || 0;

        // Check record is locked
        redisClient.get(ticket, (err, result) => {
            if (!result) {
                const timeSpent = Date.now() - start;

                callback(null, {
                    isError: true,
                    lock: call.request,
                    timeSpent,
                    message: ticketStatus.notLocked
                });
                return
            }

            const ticketInfo = JSON.parse(result);
            const oldOwner = ticketInfo.owner;
            if (!oldOwner || oldOwner !== owner) {
                const timeSpent = Date.now() - start;

                callback(null, {
                    isError: true,
                    lock: call.request,
                    timeSpent,
                    message: ticketStatus.alreadyLockedAnotherOwner
                });
                return
            }

            // Change lifetime
            redisClient.pexpire(ticket, lifetime, (err, result) => {
                if (result) {
                    const timeSpent = Date.now() - start;

                    callback(null, {
                        isError: false,
                        lock: call.request,
                        timeSpent,
                        message: ticketStatus.successLock
                    });
                } else {
                    const timeSpent = Date.now() - start;

                    callback(null, {
                        isError: true,
                        lock: call.request,
                        timeSpent,
                        message: ticketStatus.error
                    });
                }
            });
        });
    } catch (e) {
        console.error('extendLock Error');
        console.error(e.stack);
    }


}
