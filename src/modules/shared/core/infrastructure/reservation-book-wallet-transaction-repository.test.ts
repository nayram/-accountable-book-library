import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { reservationBookWalletTransactionRepository } from '.';

describe('ReservationBookWalletTransactionRepository', () => {
  describe('save', () => {
    it('should save reservation, wallet and book', async () => {
      const userId = userIdFixtures.create();
      const book = bookFixtures.create({ status: BookStatus.Reserved });
      const wallet = walletFixtures.create();
      const reservation = reservationFixtures.create({ bookId: book.id, referenceId: book.referenceId, userId });

      await reservationBookWalletTransactionRepository.save({ reservation, wallet, book });
    });
  });
});
