import { UserId } from '@modules/shared/users/domain/user-id';

export class WalletDoesNotExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceDoesNotExistsError';
  }

  static withUserId(userId: UserId) {
    return new WalletDoesNotExistsError(`User with id ${userId} does not have a wallet`);
  }
}
