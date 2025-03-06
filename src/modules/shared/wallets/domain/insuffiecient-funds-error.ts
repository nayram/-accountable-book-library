export class InsufficientFundsError extends Error {
  constructor() {
    super(`Insufficient funds. Please add funds to your wallet.`);
    this.name = 'InsufficientFundsError';
  }
}
