import { when } from 'jest-when';
import { faker } from '@faker-js/faker/locale/en';
import { mock, mockFn, MockProxy } from 'jest-mock-extended';

import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { convertDateToISODateString } from '@modules/shared/core/domain/value-objects/iso-date';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { BookDoesNotExistsError } from '@modules/books/domain/book-does-not-exist-error';
import { BookId } from '@modules/shared/books/domain/book/book-id';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { FindReferenceByIdUseCase } from '@modules/references/application/find-reference-by-id';
import { ReferenceDoesNotExistsError } from '@modules/references/domain/reference-does-not-exists-error';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { calculateLateFees as calculate } from '../domain/reservation/reservation';

import { calculateLateFeesBuilder, CalculateLateFeesUseCase } from './calculate-late-fees';

describe('calculate late fees', () => {
  let calculateLateFees: CalculateLateFeesUseCase;
  let reservationTransactionsRepository: MockProxy<ReservationTransactionsRepository>;
  let reservationRepository: MockProxy<ReservationRepository>;

  const systemDateTime = faker.date.recent();
  const userId = userIdFixtures.create();

  const wallet = walletFixtures.create({ userId });

  const reference = referenceFixtures.create({ price: 5 });

  const borrowedBook = bookFixtures.create({ status: BookStatus.Borrowed, referenceId: reference.id });
  const borrowedBook2 = bookFixtures.create({ status: BookStatus.Borrowed, referenceId: reference.id });

  const dueDate = convertDateToISODateString(systemDateTime);
  const borrowedDate = faker.date.recent({ days: 20 });
  const reservedDate = faker.date.recent({ days: 30 });

  const reservation = reservationFixtures.create({
    userId,
    bookId: borrowedBook.id,
    referenceId: reference.id,
    status: ReservationStatus.Borrowed,
    borrowedAt: borrowedDate,
    reservedAt: reservedDate,
    dueAt: dueDate,
    lateFee: 0,
  });

  const reservationWithPossibleLateFees = reservationFixtures.create({
    userId,
    bookId: borrowedBook2.id,
    referenceId: reference.id,
    status: ReservationStatus.Borrowed,
    borrowedAt: borrowedDate,
    reservedAt: reservedDate,
    dueAt: convertDateToISODateString(faker.date.recent({ days: 10 })),
    lateFee: 0,
  });

  const reservationWithLateFeesGreaterThanReferencePrice = reservationFixtures.create({
    userId,
    bookId: borrowedBook2.id,
    referenceId: reference.id,
    status: ReservationStatus.Borrowed,
    borrowedAt: faker.date.past(),
    reservedAt: faker.date.past(),
    dueAt: convertDateToISODateString(faker.date.past()),
    lateFee: 0,
  });

  const bookWithReservedState = bookFixtures.create({
    status: BookStatus.Reserved,
    referenceId: reference.id,
  });

  const reservationWithReservedState = reservationFixtures.create({
    userId,
    bookId: bookWithReservedState.id,
    referenceId: reference.id,
    status: ReservationStatus.Reserved,
    lateFee: 0,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    reservationTransactionsRepository = mock<ReservationTransactionsRepository>();
    reservationRepository = mock<ReservationRepository>();
    const walletRepository = mock<WalletRepository>();
    const getBookById = mockFn<GetBookByIdUseCase>();
    const findReferenceById = mockFn<FindReferenceByIdUseCase>();

    when(reservationRepository.findById)
      .mockImplementation((id) => {
        throw new ReservationDoesNotExistError(id);
      })
      .calledWith(reservation.id)
      .mockResolvedValue(reservation)
      .calledWith(reservationWithPossibleLateFees.id)
      .mockResolvedValue(reservationWithPossibleLateFees)
      .calledWith(reservationWithReservedState.id)
      .mockResolvedValue(reservationWithReservedState)
      .calledWith(reservationWithLateFeesGreaterThanReferencePrice.id)
      .mockResolvedValueOnce(reservationWithLateFeesGreaterThanReferencePrice);

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

    when(findReferenceById)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith({ id: reference.id })
      .mockResolvedValue(reference);

    when(walletRepository.findByUserId).calledWith(userId).mockResolvedValue(wallet);

    calculateLateFees = calculateLateFeesBuilder({
      reservationRepository,
      reservationTransactionsRepository,
      walletRepository,
      getBookById,
      findReferenceById,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should throw FieldValidationError if reservation id is invalid', () => {
    expect(
      calculateLateFees({
        reservationId: reservationIdFixtures.invalid(),
      }),
    ).rejects.toThrow(FieldValidationError);
  });

  it('should throw ReservationDoesNotExistError when reservation id does not have a reservation', async () => {
    await expect(
      calculateLateFees({
        reservationId: reservationIdFixtures.create(),
      }),
    ).rejects.toThrow(ReservationDoesNotExistError);
  });

  it('should throw ReservationFailedError when reservation status is not borrowed', async () => {
    await expect(
      calculateLateFees({
        reservationId: reservationWithReservedState.id,
      }),
    ).rejects.toThrow(ReservationFailedError);
  });

  it('should save reservation successfully with no late fees', async () => {
    await calculateLateFees({ reservationId: reservation.id });

    expect(reservationRepository.save).toHaveBeenCalledWith({
      ...reservation,
      lateFee: 0,
    });
  });

  it('should save reservation with an updated status if late fee is greater than the reference price', async () => {
    await calculateLateFees({
      reservationId: reservationWithLateFeesGreaterThanReferencePrice.id,
    });
    const dueAt = reservationWithLateFeesGreaterThanReferencePrice.dueAt || '';

    const penalty = calculate(new Date(dueAt), systemDateTime);

    expect(reservationTransactionsRepository.save).toHaveBeenCalledWith({
      reservation: {
        ...reservationWithLateFeesGreaterThanReferencePrice,
        status: ReservationStatus.Closed,
        lateFee: penalty,
      },
      book: {
        ...borrowedBook2,
        status: BookStatus.Purchased,
        updatedAt: systemDateTime,
      },
      wallet: {
        ...wallet,
        balance: wallet.balance - penalty,
        updatedAt: systemDateTime,
      },
    });
  });
});
