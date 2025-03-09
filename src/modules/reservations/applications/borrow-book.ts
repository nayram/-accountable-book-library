import { UseCase } from '@modules/shared/core/application/use-case';
import { updateStatusToBorrowed as updateBookStatusToBorrowed } from '@modules/shared/books/domain/book/book';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';

import { createReservationUpdate, Reservation, update } from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { createReservationId } from '../domain/reservation/reservation-id';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationFailedError } from '../domain/reservation-failed-error';

export interface BorrowBookRequest {
  reservationId: string;
  dueAt: string;
}

export type BorrowBookUseCase = UseCase<BorrowBookRequest, Reservation>;

export function borrowBookBuilder({
  reservationRepository,
  getBookById,
}: {
  reservationRepository: ReservationRepository;
  getBookById: GetBookByIdUseCase;
}): BorrowBookUseCase {
  return async function borrowBook(req: BorrowBookRequest) {
    const reservation = await reservationRepository.findById(createReservationId(req.reservationId));

    const book = await getBookById({ id: reservation.bookId });

    if (reservation.status != ReservationStatus.Reserved && book.status != BookStatus.Reserved) {
      throw ReservationFailedError.withBorrowBook();
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

    return updatedReservation;
  };
}
