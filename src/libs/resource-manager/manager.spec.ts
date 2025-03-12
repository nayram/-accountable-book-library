import { EventEmitter } from 'events';

import { createConnections, Resource } from './manager'; // Adjust import path as needed

describe('Connection Manager', () => {
  const createMockResource = (name: string) => {
    const resource = new EventEmitter();
    Object.assign(resource, {
      name,
      connect: jest.fn(() => {
        setTimeout(() => resource.emit('connected'), 10);
      }),
      disconnect: jest.fn(() => {
        setTimeout(() => resource.emit('disconnected'), 10);
      }),
    });
    return resource as Resource;
  };

  describe('Initialization', () => {
    it('should throw error when no resources are provided', () => {
      expect(() => createConnections()).toThrow('resources are required');
    });

    it('should throw error when a resource has no name', () => {
      const resource = createMockResource('db');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (resource as any).name;
      expect(() => createConnections(resource)).toThrow('all resources must have a name');
    });

    it('should throw error when a resource has no connect method', () => {
      const resource = createMockResource('db');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (resource as any).connect;
      expect(() => createConnections(resource)).toThrow('all resources must have a connect method');
    });

    it('should throw error when a resource has no disconnect method', () => {
      const resource = createMockResource('db');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (resource as any).disconnect;
      expect(() => createConnections(resource)).toThrow('all resources must have a disconnect method');
    });

    it('should create a connection manager with valid resources', () => {
      const db = createMockResource('db');
      const connections = createConnections(db);
      expect(connections).toBeDefined();
      expect(connections.connect).toBeInstanceOf(Function);
      expect(connections.disconnect).toBeInstanceOf(Function);
    });
  });

  describe('connect()', () => {
    it('should call connect on each resource', () => {
      const db = createMockResource('db');
      const cache = createMockResource('cache');

      const connections = createConnections(db, cache);
      connections.connect();

      expect(db.connect).toHaveBeenCalledTimes(1);
      expect(cache.connect).toHaveBeenCalledTimes(1);
    });

    it('should emit connected event when all resources are connected', (done) => {
      const db = createMockResource('db');
      const cache = createMockResource('cache');

      const connections = createConnections(db, cache);
      connections.on('connected', () => {
        done();
      });

      connections.connect();
    });

    it('should handle multiple connect calls', () => {
      const db = createMockResource('db');
      const connections = createConnections(db);

      const result1 = connections.connect();
      const result2 = connections.connect();

      expect(result1).toBe(connections);
      expect(result2).toBe(connections);
      expect(db.connect).toHaveBeenCalledTimes(2);
    });
  });

  describe('disconnect()', () => {
    it('should throw error when disconnecting before connecting', () => {
      const db = createMockResource('db');
      const connections = createConnections(db);

      expect(() => connections.disconnect()).toThrow('no resources connected yet');
    });

    it('should call disconnect on each resource', (done) => {
      const db = createMockResource('db');
      const cache = createMockResource('cache');

      const connections = createConnections(db, cache);

      connections.on('connected', () => {
        connections.disconnect();
        expect(db.disconnect).toHaveBeenCalledTimes(1);
        expect(cache.disconnect).toHaveBeenCalledTimes(1);
        done();
      });

      connections.connect();
    });

    it('should emit disconnected event when all resources are disconnected', (done) => {
      const db = createMockResource('db');
      const cache = createMockResource('cache');

      const connections = createConnections(db, cache);

      connections.on('connected', () => {
        connections.on('disconnected', () => {
          done();
        });
        connections.disconnect();
      });

      connections.connect();
    });

    it('should return the connection manager instance', (done) => {
      const db = createMockResource('db');

      const connections = createConnections(db);

      connections.on('connected', () => {
        const result = connections.disconnect();
        expect(result).toBe(connections);
        done();
      });

      connections.connect();
    });
  });
});
