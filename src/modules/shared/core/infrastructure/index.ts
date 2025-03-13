import redis from '@resources/redis';

import { queueServiceBuilder } from './queue-service';
import { uuidV4Generator } from './uuid-v4-generator';

export const uuidGenerator = uuidV4Generator;
export const queueService = queueServiceBuilder({ redis: redis() });
