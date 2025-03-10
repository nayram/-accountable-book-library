import { MockProxy, mock, mockFn } from 'jest-mock-extended';
import { when } from 'jest-when';
import { faker } from '@faker-js/faker/locale/en';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { BookId } from '@modules/shared/books/domain/book/book-id';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { reservationDueAtFixtures } from '@tests/utils/fixtures/reservations/reservation-due-at-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { BookDoesNotExistsError } from '@modules/books/domain/book-does-not-exist-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';
import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationFailedError } from '../domain/reservation-failed-error';

import { borrowBookBuilder, BorrowBookUseCase } from './borrow-book';
import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { UserDoesNotExistsError } from '@modules/shared/users/domain/user-does-not-exists-error';

describe('borrow book', () => {
  let borrowBook: BorrowBookUseCase;
  let reservationTransactionsRepository: MockProxy<ReservationTransactionsRepository>;

  const systemDateTime = faker.date.recent();

  const userId = userIdFixtures.create();
  const unAuthorisedUserId = userIdFixtures.create();

  const dueAt = reservationDueAtFixtures.create();
  const referenceId = referenceIdFixtures.create();

  const reservedBook = bookFixtures.create({ status: BookStatus.Reserved, referenceId });
  const unReservedBook = bookFixtures.create({
    status: faker.helpers.arrayElement([BookStatus.Available, BookStatus.Borrowed]),
    referenceId,
  });

  const reservation = reservationFixtures.create({
    userId,
    bookId: reservedBook.id,
    referenceId,
    status: ReservationStatus.Reserved,
    lateFee: 0,
  });

  const unReservedReservation = reservationFixtures.create({
    userId,
    bookId: unReservedBook.id,
    status: faker.helpers.arrayElement([ReservationStatus.Borrowed, ReservationStatus.Returned]),
    referenceId,
    lateFee: 0,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    reservationTransactionsRepository = mock<ReservationTransactionsRepository>();
    const reservationRepository = mock<ReservationRepository>();
    const userRepository = mock<UserRepository>();
    const getBookById = mockFn<GetBookByIdUseCase>();

    when(userRepository.exists)
      .mockImplementation((id) => {
        throw new UserDoesNotExistsError(id);
      })
      .calledWith(userId)
      .mockResolvedValue()
      .calledWith(unAuthorisedUserId)
      .mockResolvedValue();

    when(reservationRepository.findById)
      .mockImplementation((id) => {
        throw new ReservationDoesNotExistError(id);
      })
      .calledWith(reservation.id)
      .mockResolvedValue(reservation)
      .calledWith(unReservedReservation.id)
      .mockResolvedValue(unReservedReservation);

    when(getBookById)
      .mockImplementation((id: BookId) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith({ id: reservedBook.id })
      .mockResolvedValue(reservedBook)
      .calledWith({ id: unReservedBook.id })
      .mockResolvedValue(unReservedBook);

    borrowBook = borrowBookBuilder({
      reservationRepository,
      reservationTransactionsRepository,
      userRepository,
      getBookById,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError', () => {
    it('when provided with an invalid reservation id', () => {
      expect(
        borrowBook({
          reservationId: reservationIdFixtures.invalid(),
          dueAt,
          userId,
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('when provided with an invalid due date', () => {
      expect(
        borrowBook({
          reservationId: reservation.id,
          dueAt: reservationDueAtFixtures.invalid(),
          userId,
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('when provided with an invalid user id', () => {
      expect(
        borrowBook({
          reservationId: reservation.id,
          dueAt,
          userId: userIdFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw UserDoesNotExsitError when the provided user id has no corresponding user', async () => {
    await expect(
      borrowBook({
        reservationId: reservation.id,
        dueAt,
        userId: userIdFixtures.create(),
      }),
    ).rejects.toThrow(UserDoesNotExistsError);
  });

  it('should throw ReservationDoesNotExistError when reservation id does not have a reservation', async () => {
    await expect(
      borrowBook({
        reservationId: reservationIdFixtures.create(),
        dueAt,
        userId,
      }),
    ).rejects.toThrow(ReservationDoesNotExistError);
  });

  describe('should throw ReservationFailedError', () => {
    it('when an authorised user id is provided', async () => {
      await expect(
        borrowBook({
          reservationId: reservation.id,
          dueAt,
          userId: unAuthorisedUserId,
        }),
      ).rejects.toThrow(ReservationFailedError);
    });
    it('when reservation status is not reserved', async () => {
      await expect(
        borrowBook({
          reservationId: unReservedReservation.id,
          dueAt,
          userId,
        }),
      ).rejects.toThrow(ReservationFailedError);
    });
  });

  it('should borrow book successfully', async () => {
    await borrowBook({ reservationId: reservation.id, dueAt, userId });

    expect(reservationTransactionsRepository.save).toHaveBeenCalledWith({
      reservation: { ...reservation, dueAt, status: ReservationStatus.Borrowed, borrowedAt: systemDateTime },
      book: { ...reservedBook, status: BookStatus.Borrowed, updatedAt: systemDateTime },
      wallet: null,
    });
  });
});
