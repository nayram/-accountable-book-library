import { faker } from '@faker-js/faker/locale/en';

import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { bookModel } from '@modules/shared/books/infrastructure/book-model';

import { reservationModel } from '../../shared/reservations/infrastructure/reservation-model';

import { createReservationRepository } from '.';

describe('CreateReservationRepository', () => {
  describe('save', () => {
    it('should save reservation and book as a transaction', async () => {
      const userId = userIdFixtures.create();
      const book = await bookFixtures.insert({ status: BookStatus.Available });
      const reservation = reservationFixtures.create({ bookId: book.id, referenceId: book.referenceId, userId });

      const updatedBook = { ...book, status: BookStatus.Reserved, updatedAt: faker.date.recent() };

      await createReservationRepository.save({ reservation, book: updatedBook });

      const createdReservation = await reservationModel.findOne({ _id: reservation.id });

      expect(createReservationRepository).not.toBeNull();
      expect(createdReservation?._id).toEqual(reservation.id);
      expect(createdReservation?.user_id).toEqual(reservation.userId);
      expect(createdReservation?.book_id).toEqual(reservation.bookId);
      expect(createdReservation?.reference_id).toEqual(reservation.referenceId);
      expect(createdReservation?.reserved_at.toISOString()).toEqual(reservation.reservedAt.toISOString());

      const findBook = await bookModel.findOne({ _id: book.id });

      expect(findBook).not.toBeNull();
      expect(findBook?._id).toEqual(book.id);
      expect(String(findBook?.status)).toEqual(String(updatedBook.status));
      expect(findBook?.updated_at.toISOString()).toEqual(updatedBook.updatedAt.toISOString());
    });

    it('should rollback the transaction if one operation fails', async () => {
      const userId = userIdFixtures.create();
      const book = await bookFixtures.insert({ status: BookStatus.Available });
      const reservation = reservationFixtures.create({ bookId: book.id, referenceId: book.referenceId, userId });

      const updatedBook = { ...book, status: BookStatus.Reserved, updatedAt: faker.date.recent() };

      const originalUpdateOne = bookModel.updateOne;
      bookModel.updateOne = jest.fn().mockRejectedValue(new Error('Forced failure'));

      await expect(createReservationRepository.save({ reservation, book: updatedBook })).rejects.toThrow(
        'Forced failure',
      );

      const createdReservation = await reservationModel.findOne({ _id: reservation.id });
      expect(createdReservation).toBeNull();

      const findBook = await bookModel.findOne({ _id: book.id });

      expect(findBook).not.toBeNull();
      expect(findBook?._id).toEqual(book.id);
      expect(findBook?.status).not.toEqual(BookStatus.Reserved);
      expect(findBook?.updated_at.toISOString()).not.toEqual(updatedBook.updatedAt.toISOString());

      bookModel.updateOne = originalUpdateOne;
    });
  });
});
