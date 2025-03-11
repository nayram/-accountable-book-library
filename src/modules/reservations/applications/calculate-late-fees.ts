import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { credit } from '@modules/wallets/domain/wallet/wallet';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { UseCase } from '@modules/shared/core/application/use-case';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';
import { updateStatusToPurchased } from '@modules/shared/books/domain/book/book';

import { calculateLateFees as calculate, closeReservation } from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { createReservationId } from '../domain/reservation/reservation-id';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

export interface CalculateLateFeesRequest {
  reservationId: string;
}

export type CalculateLateFeesUseCase = UseCase<CalculateLateFeesRequest, void>;

export function calculateLateFeesBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  findReferenceById,
  walletRepository,
  getBookById,
}: {
  reservationRepository: ReservationRepository;
  reservationTransactionsRepository: ReservationTransactionsRepository;
  walletRepository: WalletRepository;
  findReferenceById: FindReferenceByIdUseCase;
  getBookById: GetBookByIdUseCase;
}): CalculateLateFeesUseCase {
  return async function calculateLateFees(req: CalculateLateFeesRequest) {
    const reservation = await reservationRepository.findById(createReservationId(req.reservationId));

    const book = await getBookById({ id: reservation.bookId });

    const reference = await findReferenceById({ id: reservation.referenceId });

    const wallet = await walletRepository.findByUserId(reservation.userId);

    if (reservation.status != ReservationStatus.Borrowed || book.status != BookStatus.Borrowed) {
      throw ReservationFailedError.withInValidStatus();
    }

    const lateFee = reservation.dueAt ? calculate(new Date(reservation.dueAt), new Date()) : reservation.lateFee;

    const shouldCloseReservation = lateFee >= reference.price;

    if (shouldCloseReservation) {
      const updateReservation = closeReservation({ ...reservation, lateFee });
      const updatedBook = updateStatusToPurchased(book);
      await reservationTransactionsRepository.save({
        reservation: updateReservation,
        book: updatedBook,
        wallet: credit({ wallet, amount: updateReservation.lateFee }),
      });
    } else {
      await reservationRepository.save({ ...reservation, lateFee });
    }
  };
}
