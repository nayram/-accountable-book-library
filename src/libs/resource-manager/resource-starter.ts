'use strict';
import { EventEmitter } from 'events';

import { createConnections, ConnectionManager } from './manager';

const READINESS_PROBE_DELAY = 3 * 2 * 1000;

interface Resource extends EventEmitter {
  name: string;
  connect: () => void;
  disconnect: () => void;
}

interface StartConfig {
  resources: Resource[];
  onReady: () => Promise<void>;
  onShutDown: () => Promise<void>;
  delay?: number;
}

interface ShutDownConfig {
  event: string;
  onShutDown: () => Promise<void>;
}

const onConnectionsReady = (done: () => Promise<void>) => {
  return async (): Promise<void> => {
    await done();
  };
};

const onConnectionsDead = (): void => {
  console.info('connections closed');
  process.emit('SIGINT');
};

const logAndExit = (err?: Error): void => {
  if (err) console.error({ err: err });
  process.exit();
};

const start = function ({ resources, onReady, onShutDown, delay = READINESS_PROBE_DELAY }: StartConfig): void {
  const manager = createConnections(...resources);

  manager.on('connected', onConnectionsReady(onReady)).on('disconnected', onConnectionsDead).connect();

  process
    .on('SIGTERM', (err?: Error) => {
      if (err) console.error(err);
      return setTimeout(() => shutDown(manager)({ onShutDown, event: 'SIGTERM' }), delay);
    })
    .on('SIGINT', (err?: Error) => {
      if (err) console.error(err);
      return setTimeout(() => shutDown(manager)({ onShutDown, event: 'SIGINT' }), delay);
    })
    .on('unhandledRejection', (error: Error) => {
      console.error(error);
      return setTimeout(() => shutDown(manager)({ onShutDown, event: 'SIGINT' }), delay);
    });
};

const shutDown =
  (manager: ConnectionManager) =>
  async ({ event, onShutDown }: ShutDownConfig): Promise<void> => {
    console.log(`Shutting down on ${event} event`);
    await onShutDown();
    closeResources(manager)(logAndExit);
  };

const closeResources =
  (manager: ConnectionManager) =>
  (done: (err?: Error) => void): void => {
    manager.disconnect();
    done();
  };

export { start };
