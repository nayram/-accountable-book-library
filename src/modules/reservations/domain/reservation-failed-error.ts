import { ReferenceId } from '@modules/shared/references/domain/reference-id';

export class ReservationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceAlreadyExistsError';
  }

  static withInsufficientFunds() {
    return new ReservationFailedError('User does not have enough funds');
  }

  static withAvailableBooks(referenceId: ReferenceId) {
    return new ReservationFailedError(`There are no available books for reference with id ${referenceId}`);
  }
}
