import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { credit } from '@modules/wallets/domain/wallet/wallet';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { UseCase } from '@modules/shared/core/application/use-case';
import { ReferenceRepository } from '@modules/shared/references/domain/reference-repository';

import { calculateLateFees } from '../domain/reservation/reservation';
import { ReservationRepository } from '../domain/reservation-repository';
import { createReservationId } from '../domain/reservation/reservation-id';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

export interface CalculateLateReturnsRequest {
  reservationId: string;
}

export type CalculateLatReturnsUseCase = UseCase<CalculateLateReturnsRequest, void>;

export function calculateLateReturnBuilder({
  reservationRepository,
  reservationTransactionsRepository,
  referenceRepository,
  walletRepository,
  getBookById,
}: {
  reservationRepository: ReservationRepository;
  reservationTransactionsRepository: ReservationTransactionsRepository;
  walletRepository: WalletRepository;
  referenceRepository: ReferenceRepository;
  getBookById: GetBookByIdUseCase;
}): CalculateLatReturnsUseCase {
  return async function calculateLateReturn(req: CalculateLateReturnsRequest) {
    const reservation = await reservationRepository.findById(createReservationId(req.reservationId));

    const book = await getBookById({ id: reservation.bookId });

    const reference = referenceRepository.

    const wallet = await walletRepository.findByUserId(reservation.userId);

    if (reservation.status != ReservationStatus.Borrowed && book.status != BookStatus.Borrowed) {
      throw ReservationFailedError.withInValidStatus();
    }

    const updatedReservation = calculateLateFees(reservation);

    if (updatedReservation.lateFee >= book.p)
      await reservationTransactionsRepository.save({
        reservation: updatedReservation,
        book: updatedBook,
        wallet: updatedReservation.lateFee > 0 ? credit({ wallet, amount: updatedReservation.lateFee }) : null,
      });

    return updatedReservation;
  };
}
