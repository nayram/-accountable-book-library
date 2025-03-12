'use strict';
import { EventEmitter } from 'events';

import { createConnections, ConnectionManager } from './manager';

const DELAY = 15000;

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

function onConnectionsReady(done: () => Promise<void>) {
  return async (): Promise<void> => {
    await done();
  };
}

function onConnectionsDead() {
  console.info('connections closed');
  process.emit('SIGINT');
}

const logAndExit = (err?: Error): void => {
  if (err) console.error({ err: err });
  process.exit();
};

export function start({ resources, onReady, onShutDown, delay = DELAY }: StartConfig) {
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
}

function shutDown(manager: ConnectionManager) {
  return async function ({ event, onShutDown }: ShutDownConfig): Promise<void> {
    console.log(`Shutting down on ${event} event`);
    await onShutDown();
    await closeResources(manager);
  };
}

function closeResources(manager: ConnectionManager): Promise<void> {
  return new Promise((resolve) => {
    manager.once('disconnected', () => {
      logAndExit();
      resolve();
    });

    try {
      manager.disconnect();
    } catch (err) {
      console.error('Error during disconnect:', err);
      logAndExit(err as Error);
    }
  });
}
