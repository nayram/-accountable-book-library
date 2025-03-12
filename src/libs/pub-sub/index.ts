import config from 'config';

import { redisConnector } from '@resources/redis';

import { redisPubSubBuilder } from './redis-pub-sub';

const redisUrl = config.get<string>('redisUrl');

const { getConnection } = redisConnector(redisUrl);

export const pubSubClient = redisPubSubBuilder({ client: getConnection() });
