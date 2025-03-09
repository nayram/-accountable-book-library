import { UseCase } from '@modules/shared/core/application/use-case';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { createUserId } from '@modules/shared/users/domain/user/user-id';
import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { InsufficientFundsError } from '@modules/shared/wallets/domain/insuffiecient-funds-error';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { createBookId } from '@modules/shared/books/domain/book/book-id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { updateStatusToReserved } from '@modules/shared/books/domain/book/book';
import { credit as creditWallet } from '@modules/wallets/domain/wallet/wallet';

import { ReservationFailedError } from '../domain/reservation-failed-error';
import {
  canAfford,
  Reservation,
  createReservation as create,
  isValidReservation,
} from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

export interface CreateReservationRequest {
  userId: string;
  bookId: string;
}

export type CreateReservationUseCase = UseCase<CreateReservationRequest, Reservation>;

export function createReservationBuilder({
  walletRepository,
  reservationRepository,
  userRepository,
  uuidGenerator,
  reservationTransactionsRepository,
  getBookById,
}: {
  walletRepository: WalletRepository;
  reservationRepository: ReservationRepository;
  userRepository: UserRepository;
  uuidGenerator: UuidGenerator;
  reservationTransactionsRepository: ReservationTransactionsRepository;
  getBookById: GetBookByIdUseCase;
}): CreateReservationUseCase {
  return async function createReservation(req: CreateReservationRequest) {
    const id = uuidGenerator.generate();
    const userId = createUserId(req.userId);
    const bookId = createBookId(req.bookId);

    await userRepository.exists(userId);

    const book = await getBookById({ id: bookId });

    if (book.status != BookStatus.Available) {
      throw ReservationFailedError.withBookId(book.id);
    }

    const reservations = await reservationRepository.findBySearchParams({ userId, status: ReservationStatus.Borrowed });

    const { isValid, reason } = isValidReservation(reservations, book.referenceId);

    if (!isValid) {
      throw new ReservationFailedError(reason || 'failed to borrow book');
    }

    const wallet = await walletRepository.findByUserId(userId);

    if (!canAfford(wallet.balance)) {
      throw new InsufficientFundsError();
    }

    const reservation = create({ id, userId, referenceId: book.referenceId, bookId });

    const updatedBook = updateStatusToReserved(book);

    const creditedWallet = creditWallet({ wallet, amount: reservation.reservationFee });

    await reservationTransactionsRepository.save({ reservation, book: updatedBook, wallet: creditedWallet });

    return reservation;
  };
}
