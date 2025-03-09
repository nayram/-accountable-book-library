import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { walletModel } from '@modules/shared/wallets/infrastructure/wallet-model';

import { reservationModel } from '../../shared/reservations/infrastructure/reservation-model';

import { reservationTransactionsRepositoryBuilder } from './reservation-transactions-repository';
import { reservationRepositoryBuilder } from './reservation-repository';

export const reservationTransactionsRepository = reservationTransactionsRepositoryBuilder({
  bookModel,
  reservationModel,
  walletModel: walletModel,
});

export const reservationRepository = reservationRepositoryBuilder({ model: reservationModel });
