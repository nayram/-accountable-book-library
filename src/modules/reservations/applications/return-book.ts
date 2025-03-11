import { UseCase } from '@modules/shared/core/application/use-case';
import { updateStatusToAvailable } from '@modules/shared/books/domain/book/book';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { credit } from '@modules/wallets/domain/wallet/wallet';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';

import { calculateLateFees, createReservationUpdate, Reservation, update } from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { createReservationId } from '../domain/reservation/reservation-id';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

export interface ReturnBookRequest {
  reservationId: string;
  returnedAt: string;
}

export type ReturnBookUseCase = UseCase<ReturnBookRequest, Reservation>;

export function returnBookBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  walletRepository,
  getBookById,
}: {
  reservationRepository: ReservationRepository;
  reservationTransactionsRepository: ReservationTransactionsRepository;
  walletRepository: WalletRepository;
  getBookById: GetBookByIdUseCase;
}): ReturnBookUseCase {
  return async function returnBook(req: ReturnBookRequest) {
    const reservation = await reservationRepository.findById(createReservationId(req.reservationId));

    const book = await getBookById({ id: reservation.bookId });

    const wallet = await walletRepository.findByUserId(reservation.userId);

    if (reservation.status != ReservationStatus.Borrowed || book.status != BookStatus.Borrowed) {
      throw ReservationFailedError.withInValidStatus();
    }

    const penalty = reservation.dueAt
      ? calculateLateFees(new Date(reservation.dueAt), new Date(req.returnedAt))
      : reservation.lateFee;

    const updatedReservation = update(
      reservation,
      createReservationUpdate({
        dueAt: reservation.dueAt,
        status: ReservationStatus.Returned,
        lateFee: penalty,
        borrowedAt: reservation.borrowedAt,
        returnedAt: req.returnedAt,
      }),
    );

    const updatedBook = updateStatusToAvailable(book);

    await reservationTransactionsRepository.save({
      reservation: updatedReservation,
      book: updatedBook,
      wallet: updatedReservation.lateFee > 0 ? credit({ wallet, amount: updatedReservation.lateFee }) : null,
    });

    return updatedReservation;
  };
}
