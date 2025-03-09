import { mock, mockFn, MockProxy } from 'jest-mock-extended';
import { when } from 'jest-when';
import { faker } from '@faker-js/faker/locale/en';

import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { uuidFixtures } from '@tests/utils/fixtures/shared/uuid-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { UserDoesNotExistsError } from '@modules/shared/users/domain/user-does-not-exists-error';
import { InsufficientFundsError } from '@modules/shared/wallets/domain/insuffiecient-funds-error';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { bookIdFixtures } from '@tests/utils/fixtures/books/book-id-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookDoesNotExistsError } from '@modules/books/domain/book-does-not-exist-error';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { ReservationStatus } from '../domain/reservation/reservation-status';
import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationFailedError } from '../domain/reservation-failed-error';
import { CreateReservationRepository } from '../domain/create-reservation-repository';

import { createReservationBuilder, CreateReservationUseCase } from './create-reservation';

describe('create reservation', () => {
  let createReservation: CreateReservationUseCase;
  let createReservationRepository: MockProxy<CreateReservationRepository>;

  const systemDateTime = faker.date.recent();

  const id = uuidFixtures.create();

  const userId = userIdFixtures.create();
  const userIdExceedingBorrowLimit = userIdFixtures.create();
  const userIdWithExistingBorrowedReference = userIdFixtures.create();
  const userIdWithInsufficientBalance = userIdFixtures.create();

  const referenceId = referenceIdFixtures.create();

  const availableBook = bookFixtures.create({
    referenceId,
    status: BookStatus.Available,
  });

  const unAvailableBook = bookFixtures.create({
    referenceId,
    status: faker.helpers.arrayElement([BookStatus.Borrowed, BookStatus.Reserved]),
  });

  const reservations = reservationFixtures.createMany({
    length: 2,
    reservation: { status: ReservationStatus.Borrowed, userId },
  });

  const reservationsOfUserWithInsuficientBalance = reservationFixtures.createMany({
    length: 2,
    reservation: { status: ReservationStatus.Borrowed, userId: userIdWithInsufficientBalance },
  });

  const reservationsExceedingBorrowLimit = reservationFixtures.createMany({
    reservation: { status: ReservationStatus.Borrowed, userId: userIdExceedingBorrowLimit },
    length: 5,
  });

  const reservationsWithExistingBorrowedReference = [
    reservationFixtures.create({
      status: ReservationStatus.Borrowed,
      userId: userIdWithExistingBorrowedReference,
      referenceId,
    }),
  ];

  const reservation = reservationFixtures.create({
    id,
    dueAt: null,
    returnedAt: null,
    borrowedAt: null,
    reservedAt: systemDateTime,
    userId,
    referenceId,
    bookId: availableBook.id,
    status: ReservationStatus.Reserved,
    lateFee: 0,
  });

  const wallet = walletFixtures.create({ userId });
  const walletOFUserInsufficientFunds = walletFixtures.create({ userId: userIdWithInsufficientBalance, balance: 0 });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    const uuidGenerator = mock<UuidGenerator>();
    const walletRepository = mock<WalletRepository>();
    const userRepository = mock<UserRepository>();
    const reservationRepository = mock<ReservationRepository>();
    createReservationRepository = mock<CreateReservationRepository>();
    const getBookById = mockFn<GetBookByIdUseCase>();

    when(uuidGenerator.generate).mockReturnValue(id);

    when(userRepository.exists)
      .mockImplementation((id) => {
        throw new UserDoesNotExistsError(id);
      })
      .calledWith(userId)
      .mockResolvedValue()
      .calledWith(userIdExceedingBorrowLimit)
      .mockResolvedValue()
      .calledWith(userIdWithExistingBorrowedReference)
      .mockResolvedValue()
      .calledWith(userIdWithInsufficientBalance)
      .mockResolvedValue();

    when(getBookById)
      .mockImplementation(({ id }) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith({ id: availableBook.id })
      .mockResolvedValue(availableBook)
      .calledWith({ id: unAvailableBook.id })
      .mockResolvedValue(unAvailableBook);

    when(reservationRepository.findBySearchParams)
      .calledWith({ userId, status: ReservationStatus.Borrowed })
      .mockResolvedValue(reservations)
      .calledWith({ userId: userIdWithInsufficientBalance, status: ReservationStatus.Borrowed })
      .mockResolvedValue(reservationsOfUserWithInsuficientBalance)
      .calledWith({ userId: userIdExceedingBorrowLimit, status: ReservationStatus.Borrowed })
      .mockResolvedValue(reservationsExceedingBorrowLimit)
      .calledWith({ userId: userIdWithExistingBorrowedReference, status: ReservationStatus.Borrowed })
      .mockResolvedValue(reservationsWithExistingBorrowedReference);

    when(walletRepository.findByUserId)
      .calledWith(userId)
      .mockResolvedValue(wallet)
      .calledWith(userIdWithInsufficientBalance)
      .mockResolvedValue(walletOFUserInsufficientFunds);

    createReservation = createReservationBuilder({
      userRepository,
      walletRepository,
      getBookById,
      reservationRepository,
      createReservationRepository,
      uuidGenerator,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid user id', () => {
      expect(createReservation({ userId: userIdFixtures.invalid(), bookId: availableBook.id })).rejects.toThrow(
        FieldValidationError,
      );
    });

    it('provided invalid book id', () => {
      expect(
        createReservation({
          userId,
          bookId: bookIdFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw UserDoesNotExistsError when the userid does not have a corresponding user data', async () => {
    await expect(createReservation({ userId: userIdFixtures.create(), bookId: availableBook.id })).rejects.toThrow(
      UserDoesNotExistsError,
    );
  });

  it('should throw BookDoesNotExistError when bookId does not have a correspoding book data', async () => {
    await expect(createReservation({ userId, bookId: bookIdFixtures.create() })).rejects.toThrow(
      BookDoesNotExistsError,
    );
  });

  describe('should throw ReservationFailedError when', () => {
    it('provided with an unavaible book id', async () => {
      await expect(createReservation({ userId, bookId: unAvailableBook.id })).rejects.toThrow(ReservationFailedError);
    });

    it('provided with the userid of a user that has exceeded the borrow limit', async () => {
      await expect(createReservation({ userId: userIdExceedingBorrowLimit, bookId: availableBook.id })).rejects.toThrow(
        ReservationFailedError,
      );
    });

    it('provided with the userId of a user that has an active borrowed reservation of a reference', async () => {
      await expect(
        createReservation({ userId: userIdWithExistingBorrowedReference, bookId: availableBook.id }),
      ).rejects.toThrow(ReservationFailedError);
    });
  });

  it('should throw InsufficientFundsError user does not have enough Balance', async () => {
    await expect(
      createReservation({ userId: userIdWithInsufficientBalance, bookId: availableBook.id }),
    ).rejects.toThrow(InsufficientFundsError);
  });

  it('should create reservation', async () => {
    const result = await createReservation({ userId, bookId: availableBook.id });
    expect(result).toEqual(reservation);
    expect(createReservationRepository.save).toHaveBeenCalledWith({
      reservation,
      book: { ...availableBook, status: ReservationStatus.Reserved, updatedAt: systemDateTime },
    });
  });
});
