import redis from '@resources/redis';

import { redisPubSubBuilder } from './redis-pub-sub';

export const pubSubClient = redisPubSubBuilder({ client: redis() });
