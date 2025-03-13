import { Server } from 'http';

import config from 'config';

import { connectMongoDb as db } from '@resources/mongodb';
import { start } from '@libs/resource-manager/resource-starter';

import app from './app';

const port = config.get<number>('port');

let server: Server;

async function onReady() {
  if (!server) {
    server = app
      .listen(port, (error) => {
        if (error) {
          console.error(error);
        }
        console.info(`Server is running on ${port}`);
      })
      .on('error', (error) => {
        console.error('error', error);
        process.emit('SIGTERM');
      });
  }
}

async function onShutDown() {
  if (server) {
    server.close();
    console.info('Server shutdown');
  }
}

start({ resources: [db()], onReady, onShutDown });
