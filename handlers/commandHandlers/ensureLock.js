import { getRedisClient } from '../../redis/redis-client.js';
import { ticketStatus } from "../utils/ticketStatus.js";

const redisClient = getRedisClient();

export function ensureLock(call, callback) {
    try {
        const start = Date.now();

        const { ticket, ...values } = call.request;
        const { owner } = values;
        const { lifetime } = values || 0;

        // Check record is locked
        redisClient.get(ticket, (err, result) => {
            if (result) {
                result = JSON.parse(result);
                const ownerResult = result.owner;

                if (owner !== ownerResult) {
                    const timeSpent = Date.now() - start;

                    callback(null, {
                        isError: true,
                        lock: call.request,
                        timeSpent,
                        message: ticketStatus.alreadyLockedAnotherOwner
                    });
                    return
                }

                // Trying to set up lock with same owner
                redisClient.set(ticket, JSON.stringify(values), 'PX', lifetime, (err, result) => {

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
            } else {
                // Trying to set up lock without lock
                redisClient.set(ticket, JSON.stringify(values), 'PX', lifetime, 'NX', (err, result) => {
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
            }
        });
    } catch (e) {
        console.log('ensureLock Error');
        console.error(e.stack);
    }
}
