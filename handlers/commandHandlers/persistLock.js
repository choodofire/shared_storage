import { getRedisClient } from '../../redis/redis-client.js';
import { ticketStatus } from "../utils/ticketStatus.js";

const redisClient = getRedisClient();

export function persistLock(call, callback) {
    try {
        const start = Date.now();

        const { ticket, ...values } = call.request;
        delete values.lifetime;

        // Trying to set up persist lock
        redisClient.set(ticket, JSON.stringify(values), 'NX', (err, result) => {
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
        console.error('persistLock Error');
        console.error(e.stack);
    }
}
