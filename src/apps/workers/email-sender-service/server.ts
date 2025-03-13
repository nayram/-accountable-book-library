import { Server } from 'http';

import config from 'config';

import { start } from '@libs/resource-manager/resource-starter';
import redis, { RedisConsumer } from '@resources/redis';

import app from './app';
import { subscribe } from './subscribe';

const port = config.get<number>('emailServicePort');

let subscriber: RedisConsumer;
let server: Server;

async function onReady() {
  if (!server) {
    server = app.listen(port, () => {
      console.info(`Server is running on ${port}`);
    });
    subscriber = await subscribe();
  }
}

async function onShutDown() {
  if (subscriber) {
    subscriber.close();
  }
  if (server) {
    server.close();
    console.info('Server shutdown successfully');
  }
}

start({ resources: [redis()], onReady, onShutDown });
