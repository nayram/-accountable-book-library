'use strict';
import { EventEmitter } from 'events';

export interface Resource extends EventEmitter {
  name: string;
  connect: () => void;
  disconnect: () => void;
}

export interface ConnectionManager extends EventEmitter {
  connect: () => ConnectionManager;
  disconnect: () => ConnectionManager;
}

export function createConnections(...resources: Resource[]): ConnectionManager {
  const hasNoResourceName = resources.some((resource) => !resource.name);
  const hasNoConnectMethod = resources.some((resource) => !resource.connect);
  const hasNoDisconnectMethod = resources.some((resource) => !resource.disconnect);

  if (resources.length === 0) {
    throw new Error('resources are required');
  }
  if (hasNoResourceName) {
    throw new Error('all resources must have a name');
  }

  if (hasNoConnectMethod) {
    throw new Error('all resources must have a connect method');
  }

  if (hasNoDisconnectMethod) {
    throw new Error('all resources must have a disconnect method');
  }

  const connections = new EventEmitter();

  let numOfConnectedresources = 0;

  const onReady = () => {
    numOfConnectedresources++;
    if (numOfConnectedresources === resources.length) {
      connections.emit('connected');
    }
  };

  const onDisconnected = () => {
    numOfConnectedresources--;
    if (numOfConnectedresources === 0) {
      connections.emit('disconnected');
    }
  };

  return Object.assign(connections, {
    connect() {
      numOfConnectedresources = 0;

      resources.forEach((resource) => {
        resource.on('connected', onReady);
        resource.connect();
      });
      return this as ConnectionManager;
    },
    disconnect() {
      if (numOfConnectedresources === 0) {
        throw new Error('no resources connected yet');
      }

      resources.forEach((resource) => {
        resource.on('disconnected', onDisconnected);
        resource.disconnect();
      });
      return this as ConnectionManager;
    },
  }) as ConnectionManager;
}
