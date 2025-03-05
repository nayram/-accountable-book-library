export class ReferenceBookModelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceBookTransactionalModelError';
  }
}
