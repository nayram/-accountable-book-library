import redis from '@resources/redis';

import { QUEUE_EMAIL_SERVICE_TOPIC } from '../domain/queue-service';

import { queueServiceBuilder } from './queue-service';
import { uuidV4Generator } from './uuid-v4-generator';

export const uuidGenerator = uuidV4Generator;
export const queueService = queueServiceBuilder({ redis: redis() });

queueService.create(QUEUE_EMAIL_SERVICE_TOPIC);
