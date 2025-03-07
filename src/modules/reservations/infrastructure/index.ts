import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { walletModel } from '@modules/shared/wallets/infrastructure/wallet-model';

import { createReservationRepositoryBuilder } from './create-reservation-repository';
import { reservationModel } from './reservation-model';
import { reservationRepositoryBuilder } from './reservation-repository';

export const createReservationRepository = createReservationRepositoryBuilder({
  bookModel,
  reservationModel,
  walletModel: walletModel,
});

export const reservationRepository = reservationRepositoryBuilder({ model: reservationModel });
