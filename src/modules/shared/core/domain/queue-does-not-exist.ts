export class QueueDoesNotExistError extends Error {
  constructor(topic: string) {
    super(`Queue, ${topic} does not exist`);
    this.name = 'QueueDoesNotExist';
  }
}
