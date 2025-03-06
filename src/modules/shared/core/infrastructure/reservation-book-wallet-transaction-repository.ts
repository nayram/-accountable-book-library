import mongoose from 'mongoose';

import { ReservationModel } from '@modules/reservations/infrastructure/reservation-model';
import { BookModel } from '@modules/shared/books/infrastructure/book-model';
import { WalletModel } from '@modules/shared/wallets/infrastructure/wallet-model';
import { toDTO as toReservationDTO } from '@modules/reservations/infrastructure/reservation-dto';
import { toDTO as toBookDTO } from '@modules/shared/books/infrastructure/book-dto';
import { toDTO as toWalletDTO } from '@modules/shared/wallets/infrastructure/wallet-dto';

import { ReservationBookWalletTransactionRepository } from '../domain/reservation-book-wallet-transaction-repository';

import { ReservationBookWalletModelError } from './reservation-book-wallet-transaction-model-error';

export function reservationBookWalletTransactionRepositoryBuilder({
  bookModel,
  walletModel,
  reservationModel,
}: {
  bookModel: BookModel;
  walletModel: WalletModel;
  reservationModel: ReservationModel;
}): ReservationBookWalletTransactionRepository {
  return {
    async save({ reservation, book, wallet }) {
      try {
        await reservationModel.create(toReservationDTO(reservation));
        await bookModel.create(toBookDTO(book));
        await walletModel.create(toWalletDTO(wallet));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(error);
        throw new ReservationBookWalletModelError(error.message);
      }
    },
  };
}
