import { UseCase } from '@modules/shared/core/application/use-case';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { BookRepository } from '@modules/shared/books/domain/book-repository';
import { createUserId } from '@modules/shared/users/domain/user/user-id';
import { createReferenceId } from '@modules/shared/references/domain/reference-id';
import { getAvailableBooks, updateStatusToReserved } from '@modules/shared/books/domain/book/book';
import { credit as creditWallet } from '@modules/wallets/domain/wallet/wallet';

import {
  canAfford,
  Reservation,
  reservationCost,
  createReservation as create,
} from '../domain/reservation/reservation';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { CreateReservationRepository } from '../domain/create-reservation-repository';

export interface CreateReservationRequest {
  userId: string;
  referenceId: string;
}

export type CreateReservationUseCase = UseCase<CreateReservationRequest, Reservation>;

export function createReservationBuilder({
  walletRepository,
  bookRepository,
  createReservationRepository,
  uuidGenerator,
}: {
  walletRepository: WalletRepository;
  bookRepository: BookRepository;
  createReservationRepository: CreateReservationRepository;
  uuidGenerator: UuidGenerator;
}): CreateReservationUseCase {
  return async function createReservation(req: CreateReservationRequest) {
    const id = uuidGenerator.generate();
    const userId = createUserId(req.userId);
    const referenceId = createReferenceId(req.referenceId);

    const wallet = await walletRepository.findByUserId(userId);

    if (!canAfford(wallet.balance)) {
      throw ReservationFailedError.withInsufficientFunds();
    }

    const books = await bookRepository.find({ referenceId });

    const availableBooks = getAvailableBooks(books);

    if (availableBooks.length === 0) {
      throw ReservationFailedError.withAvailableBooks(referenceId);
    }

    const reservedBook = updateStatusToReserved(availableBooks[0]);
    const creditedWallet = creditWallet({ wallet, amount: reservationCost });
    const reservation = create({ id, userId, referenceId, bookId: reservedBook.id });
    await createReservationRepository.save({ reservation, book: reservedBook, wallet: creditedWallet });

    return reservation;
  };
}
