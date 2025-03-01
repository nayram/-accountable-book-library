import { Server } from 'http';

import config from 'config';

import { isConnected, connectMongoDb as db } from '@resources/mongodb';

import app from './app';

const port = config.get<number>('port');

function bookLibraryServerBuilder() {
  let server: Server;
  return {
    async start() {
      if (isConnected()) return;
      await db()
        .on('connected', async () => {
          if (!server) {
            server = app.listen(port, () => {
              console.info(`Server is running on ${port}`);
            });
          }
        })
        .on('disconnected', () => {
          console.info('connections closed');
          if (server) {
            server.close();
            console.info('Server shutdown');
          }
        })
        .connect();
    },
    async stop() {
      if (isConnected()) {
        await db().disconnect();
      }
    },
  };
}

export const server = bookLibraryServerBuilder();
