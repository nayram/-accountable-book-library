import { mock, MockProxy } from 'jest-mock-extended';
import { WalletRepository } from '@modules/shared/wallets/domain/wallet-repository';
import { BookRepository } from '@modules/shared/books/domain/book-repository';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { when } from 'jest-when';
import { uuidFixtures } from '@tests/utils/fixtures/shared/uuid-fixtures';
import { faker } from '@faker-js/faker/locale/en';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { WalletDoesNotExistsError } from '@modules/shared/wallets/domain/wallet-does-not-exists-error';
import { Book } from '@modules/shared/books/domain/book/book';
import { Wallet } from '@modules/wallets/domain/wallet/wallet';
import { ReferenceRepository } from '@modules/shared/references/domain/reference-repository';
import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { UserDoesNotExistsError } from '@modules/shared/users/domain/user-does-not-exists-error';
import { ReferenceDoesNotExistsError } from '@modules/shared/references/domain/reference-does-not-exists-error';
import { InsufficientFundsError } from '@modules/shared/wallets/domain/insuffiecient-funds-error';

import { ReservationFailedError } from '../domain/reservation-failed-error';
import { CreateReservationRepository } from '../domain/create-reservation-repository';

import { createReservationBuilder, CreateReservationUseCase } from './create-reservation';

describe('create reservation', () => {
  let createReservation: CreateReservationUseCase;
  let createReservationRepository: MockProxy<CreateReservationRepository>;

  const systemDateTime = faker.date.recent();

  const id = uuidFixtures.create();

  const userId = userIdFixtures.create();
  const userIdOfUserWithoutEnoughBalance = userIdFixtures.create();
  const userIdOfUserNoWithNoWallet = userIdFixtures.create();

  const referenceId = referenceIdFixtures.create();
  const referenceIdWithUnAvailableBooks = referenceIdFixtures.create();

  const availableBooks = bookFixtures.createMany({
    book: { id, status: BookStatus.Available, referenceId, createdAt: systemDateTime, updatedAt: systemDateTime },
  });
  const unavailableBooks = bookFixtures.createMany({
    book: {
      id,
      status: faker.helpers.arrayElements([BookStatus.Borrowed, BookStatus.Reserved]) as unknown as BookStatus,
      referenceId: referenceIdWithUnAvailableBooks,
      createdAt: systemDateTime,
      updatedAt: systemDateTime,
    },
  });

  const walletWithEnoughBalance = walletFixtures.create({
    id,
    userId,
    createdAt: systemDateTime,
    updatedAt: systemDateTime,
  });

  const walletWithoutEnoughBalance = walletFixtures.create({
    id,
    userId: userIdOfUserWithoutEnoughBalance,
    balance: 0,
    createdAt: systemDateTime,
    updatedAt: systemDateTime,
  });

  const reservedBook: Book = { ...availableBooks[0], status: BookStatus.Reserved };

  const creditedWallet: Wallet = { ...walletWithEnoughBalance, balance: walletWithEnoughBalance.balance - 3 };

  const reservation = reservationFixtures.create({
    id,
    userId,
    bookId: reservedBook.id,
    referenceId,
    reservedAt: systemDateTime,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    createReservationRepository = mock<CreateReservationRepository>();
    const walletRepository = mock<WalletRepository>();
    const bookRepository = mock<BookRepository>();
    const referenceRepository = mock<ReferenceRepository>();
    const userRepository = mock<UserRepository>();
    const uuidGenerator = mock<UuidGenerator>();

    when(uuidGenerator.generate).mockReturnValue(id);

    when(userRepository.exists)
      .mockImplementation((id) => {
        throw new UserDoesNotExistsError(id);
      })
      .calledWith(userId)
      .mockResolvedValue()
      .calledWith(userIdOfUserWithoutEnoughBalance)
      .mockResolvedValue()
      .calledWith(userIdOfUserNoWithNoWallet)
      .mockResolvedValue();

    when(referenceRepository.exists)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith(referenceId)
      .mockResolvedValue()
      .calledWith(userIdOfUserWithoutEnoughBalance)
      .mockResolvedValue()
      .calledWith(referenceIdWithUnAvailableBooks)
      .mockResolvedValue();

    when(walletRepository.findByUserId)
      .mockImplementation((id) => {
        throw new WalletDoesNotExistsError(id);
      })
      .calledWith(userId)
      .mockResolvedValue(walletWithEnoughBalance)
      .calledWith(userIdOfUserWithoutEnoughBalance)
      .mockResolvedValue(walletWithoutEnoughBalance);

    when(bookRepository.find)
      .calledWith({ referenceId })
      .mockResolvedValue(availableBooks)
      .calledWith({ referenceId: referenceIdWithUnAvailableBooks })
      .mockResolvedValue(unavailableBooks);

    createReservation = createReservationBuilder({
      referenceRepository,
      userRepository,
      walletRepository,
      bookRepository,
      createReservationRepository,
      uuidGenerator,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid user id', () => {
      expect(createReservation({ userId: userIdFixtures.invalid(), referenceId })).rejects.toThrow(
        FieldValidationError,
      );
    });

    it('provided invalid reference id', () => {
      expect(
        createReservation({
          userId,
          referenceId: referenceIdFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  describe('should throw UserDoesNotExistsError when', () => {
    it('userid does not have a corresponding user data', () => {
      expect(createReservation({ userId: userIdFixtures.create(), referenceId })).rejects.toThrow(
        UserDoesNotExistsError,
      );
    });
  });

  describe('should throw ReferenceDoesNotExistsError when', () => {
    it('refenceId does not have a correspoding user data', () => {
      expect(createReservation({ userId, referenceId: referenceIdFixtures.create() })).rejects.toThrow(
        ReferenceDoesNotExistsError,
      );
    });
  });

  describe('should throw InsufficientFundsError', () => {
    it('user does not have enough Balance', () => {
      expect(createReservation({ userId: userIdOfUserWithoutEnoughBalance, referenceId })).rejects.toThrow(
        InsufficientFundsError,
      );
    });
  });

  describe('should throw ReservationFailedError when', () => {
    it('reference does not have enough books', () => {
      expect(createReservation({ userId, referenceId: referenceIdWithUnAvailableBooks })).rejects.toThrow(
        ReservationFailedError,
      );
    });
  });

  describe('should throw WalletDoesNotExistsError when', () => {
    it('user does not have a wallet', async () => {
      expect(createReservation({ userId: userIdOfUserNoWithNoWallet, referenceId })).rejects.toThrow(
        WalletDoesNotExistsError,
      );
    });
  });

  it('should create reservation', async () => {
    const result = await createReservation({ userId, referenceId });
    expect(result).toEqual(reservation);
    expect(createReservationRepository.save).toHaveBeenCalledWith({
      reservation,
      book: reservedBook,
      wallet: creditedWallet,
    });
  });
});
