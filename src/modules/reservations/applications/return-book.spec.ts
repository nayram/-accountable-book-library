import config from 'config';
import { MockProxy, mock, mockFn } from 'jest-mock-extended';
import { when } from 'jest-when';
import { faker } from '@faker-js/faker/locale/en';

import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { BookId } from '@modules/shared/books/domain/book/book-id';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { reservationReturnedAtFixtures } from '@tests/utils/fixtures/reservations/reservation-returned-at-fixtures';
import { convertDateToISODateString } from '@modules/shared/core/domain/value-objects/iso-date';
import { Money } from '@modules/shared/core/domain/value-objects/money';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { BookDoesNotExistsError } from '@modules/books/domain/book-does-not-exist-error';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';
import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { calculateLateFees } from '../domain/reservation/reservation';

import { returnBookBuilder, ReturnBookUseCase } from './return-book';

export const lateReturnPenalty = config.get<Money>('lateFee');

describe('return book', () => {
  let returnBook: ReturnBookUseCase;
  let reservationTransactionsRepository: MockProxy<ReservationTransactionsRepository>;

  const systemDateTime = faker.date.recent();

  const userId = userIdFixtures.create();

  const wallet = walletFixtures.create({ userId });

  const referenceId = referenceIdFixtures.create();

  const borrowedBook = bookFixtures.create({ status: BookStatus.Borrowed, referenceId });
  const borrowedBook2 = bookFixtures.create({ status: BookStatus.Borrowed, referenceId });

  const dueDate = convertDateToISODateString(systemDateTime);

  const borrowedDate = faker.date.past();
  const reservedDate = faker.date.past();

  const reservation = reservationFixtures.create({
    userId,
    bookId: borrowedBook.id,
    referenceId,
    status: ReservationStatus.Borrowed,
    borrowedAt: borrowedDate,
    reservedAt: reservedDate,
    dueAt: dueDate,
    lateFee: 0,
  });

  const reservationWithPossibleLateFees = reservationFixtures.create({
    userId,
    bookId: borrowedBook2.id,
    referenceId,
    status: ReservationStatus.Borrowed,
    borrowedAt: borrowedDate,
    reservedAt: reservedDate,
    dueAt: convertDateToISODateString(faker.date.past()),
    lateFee: 0,
  });

  const bookWithReservedState = bookFixtures.create({
    status: BookStatus.Reserved,
    referenceId,
  });

  const reservationWithReservedState = reservationFixtures.create({
    userId,
    bookId: bookWithReservedState.id,
    referenceId,
    status: ReservationStatus.Reserved,
    lateFee: 0,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    reservationTransactionsRepository = mock<ReservationTransactionsRepository>();
    const reservationRepository = mock<ReservationRepository>();
    const walletRepository = mock<WalletRepository>();
    const getBookById = mockFn<GetBookByIdUseCase>();

    when(reservationRepository.findById)
      .mockImplementation((id) => {
        throw new ReservationDoesNotExistError(id);
      })
      .calledWith(reservation.id)
      .mockResolvedValue(reservation)
      .calledWith(reservationWithPossibleLateFees.id)
      .mockResolvedValue(reservationWithPossibleLateFees)
      .calledWith(reservationWithReservedState.id)
      .mockResolvedValue(reservationWithReservedState);

    when(getBookById)
      .mockImplementation((id: BookId) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith({ id: borrowedBook.id })
      .mockResolvedValue(borrowedBook)
      .calledWith({ id: borrowedBook2.id })
      .mockResolvedValue(borrowedBook2)
      .calledWith({ id: bookWithReservedState.id })
      .mockResolvedValue(bookWithReservedState);

    when(walletRepository.findByUserId).calledWith(userId).mockResolvedValue(wallet);

    returnBook = returnBookBuilder({
      reservationRepository,
      reservationTransactionsRepository,
      walletRepository,
      getBookById,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError', () => {
    it('when provided with an invalid reservation id', () => {
      expect(
        returnBook({
          reservationId: reservationIdFixtures.invalid(),
          returnedAt: reservationReturnedAtFixtures.create(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('when provided with an invalid returned date', () => {
      expect(
        returnBook({
          reservationId: reservation.id,
          returnedAt: reservationReturnedAtFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw ReservationDoesNotExistError when reservation id does not have a reservation', async () => {
    await expect(
      returnBook({
        reservationId: reservationIdFixtures.create(),
        returnedAt: reservationReturnedAtFixtures.create(),
      }),
    ).rejects.toThrow(ReservationDoesNotExistError);
  });

  it('should throw ReservationFailedError when reservation status is not borrowed', async () => {
    await expect(
      returnBook({
        reservationId: reservationWithReservedState.id,
        returnedAt: reservationReturnedAtFixtures.create(),
      }),
    ).rejects.toThrow(ReservationFailedError);
  });

  it('should return book successfully with no late fees', async () => {
    await returnBook({ reservationId: reservation.id, returnedAt: dueDate });

    expect(reservationTransactionsRepository.save).toHaveBeenCalledWith({
      reservation: { ...reservation, returnedAt: dueDate, status: ReservationStatus.Returned, lateFee: 0 },
      book: { ...borrowedBook, status: BookStatus.Available, updatedAt: systemDateTime },
      wallet: null,
    });
  });

  it('should return book successfully with late fees', async () => {
    const returnedAt = convertDateToISODateString(systemDateTime);
    const dueAt = reservationWithPossibleLateFees.dueAt || '';
    await returnBook({
      reservationId: reservationWithPossibleLateFees.id,
      returnedAt,
    });

    const penalty = calculateLateFees(new Date(dueAt), new Date(returnedAt));

    expect(reservationTransactionsRepository.save).toHaveBeenCalledWith({
      reservation: {
        ...reservationWithPossibleLateFees,
        returnedAt,
        status: ReservationStatus.Returned,
        lateFee: penalty,
      },
      book: { ...borrowedBook2, status: BookStatus.Available, updatedAt: systemDateTime },
      wallet: { ...wallet, balance: wallet.balance - penalty, updatedAt: systemDateTime },
    });
  });
});
