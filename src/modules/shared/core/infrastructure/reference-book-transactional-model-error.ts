export class ReferenceBookTransactionalModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceBookTransactionalModelError';
  }
}
