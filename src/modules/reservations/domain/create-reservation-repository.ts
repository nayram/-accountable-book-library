import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { Book } from '@modules/shared/books/domain/book/book';

export interface CreateReservationRepository {
  save({ reservation, book }: { reservation: Reservation; book: Book }): Promise<void>;
}
