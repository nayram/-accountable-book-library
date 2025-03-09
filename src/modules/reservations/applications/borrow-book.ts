import { UseCase } from '@modules/shared/core/application/use-case';
import { updateStatusToBorrowed as updateBookStatusToBorrowed } from '@modules/shared/books/domain/book/book';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { createUserId } from '@modules/shared/users/domain/user/user-id';
import { UserRepository } from '@modules/shared/users/domain/user-repository';

import { createReservationUpdate, Reservation, update } from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { createReservationId } from '../domain/reservation/reservation-id';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

export interface BorrowBookRequest {
  reservationId: string;
  dueAt: string;
  userId: string;
}

export type BorrowBookUseCase = UseCase<BorrowBookRequest, Reservation>;

export function borrowBookBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  getBookById,
}: {
  reservationRepository: ReservationRepository;
  reservationTransactionsRepository: ReservationTransactionsRepository;
  userRepository: UserRepository;
  getBookById: GetBookByIdUseCase;
}): BorrowBookUseCase {
  return async function borrowBook(req: BorrowBookRequest) {
    const reservation = await reservationRepository.findById(createReservationId(req.reservationId));

    if (reservation.userId != createUserId(req.userId)) {
      throw ReservationFailedError.withUserId();
    }

    const book = await getBookById({ id: reservation.bookId });

    if (reservation.status != ReservationStatus.Reserved && book.status != BookStatus.Reserved) {
      throw ReservationFailedError.inValidStatus();
    }

    const updatedReservation = update(
      reservation,
      createReservationUpdate({
        dueAt: req.dueAt,
        status: ReservationStatus.Borrowed,
        lateFee: reservation.lateFee,
        borrowedAt: new Date(),
        returnedAt: reservation.returnedAt,
      }),
    );

    const updatedBook = updateBookStatusToBorrowed(book);

    await reservationTransactionsRepository.save({ reservation: updatedReservation, book: updatedBook });

    return updatedReservation;
  };
}
