import { getRedisClient } from '../../redis/redis-client.js';
import { ticketStatus } from "../utils/ticketStatus.js";

const redisClient = getRedisClient();

export function releaseLock(call, callback) {
    try {
        const start = Date.now();

        const { ticket, owner } = call.request;

        // Checking if record is locked
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

            // Unblock if record is locked
            redisClient.del(ticket, (err, result) => {
                if (result) {
                    const timeSpent = Date.now() - start;

                    callback(null, {
                        isError: false,
                        lock: call.request,
                        timeSpent,
                        message: ticketStatus.successUnlock
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
        console.error('releaseLock Error');
        console.error(e.stack);
    }

}
