import { getRedisClient } from '../../redis/redis-client.js';
import { ticketStatus } from "../utils/ticketStatus.js";

const redisClient = getRedisClient();

export function acquireLock(call, callback) {
    try {
        const start = Date.now();

        const { ticket, ...values } = call.request;
        const { lifetime } = values || 0;

        // Trying to set up lock
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
                    message: ticketStatus.alreadyLocked });
            }
        });
    } catch (e) {
        console.log('acquireLock Error');
        console.error(e.stack);
    }
}
