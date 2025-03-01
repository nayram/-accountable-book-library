import { server } from './server';

server.start();

async function handleServerShutdown() {
  console.log('🛑 Gracefully shutting down...');
  await server.stop();
  process.exit(0);
}

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
process.on('SIGQUIT', handleServerShutdown);
