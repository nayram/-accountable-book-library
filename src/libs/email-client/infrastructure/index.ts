import config from 'config';

import { sendGridClientBuilder } from './send-grid-client';

const apiKey = config.get<string>('sendGridApiKey');
const env = config.get<'test' | 'live'>('emailEnv');

export const emailClient = sendGridClientBuilder({ apiKey, env });
