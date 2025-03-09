import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { Book } from '@modules/shared/books/domain/book/book';
import { Wallet } from '@modules/wallets/domain/wallet/wallet';

export interface ReservationTransactionsRepository {
  save({ reservation, book, wallet }: { reservation: Reservation; book: Book; wallet: Wallet }): Promise<void>;
}
