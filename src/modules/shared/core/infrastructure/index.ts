import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { reservationModel } from '@modules/reservations/infrastructure/reservation-model';
import { walletModel } from '@modules/shared/wallets/infrastructure/wallet-model';

import { referenceBookRepositoryBuilder } from './reference-book-repository';
import { uuidV4Generator } from './uuid-v4-generator';
import { reservationBookWalletTransactionRepositoryBuilder } from './reservation-book-wallet-transaction-repository';

export const uuidGenerator = uuidV4Generator;
export const referenceBookRepository = referenceBookRepositoryBuilder({
  bookModel,
  referenceModel,
});

export const reservationBookWalletTransactionRepository = reservationBookWalletTransactionRepositoryBuilder({
  bookModel,
  walletModel,
  reservationModel,
});
