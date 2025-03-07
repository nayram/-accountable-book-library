import { faker } from '@faker-js/faker/locale/en';
import { when } from 'jest-when';
import { mock, MockProxy } from 'jest-mock-extended';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { barcodeFixtures } from '@tests/utils/fixtures/books/bar-code-fixtures';
import { bookStatusFixtures } from '@tests/utils/fixtures/books/book-status-fixtures';
import { ReferenceRepository } from '@modules/shared/references/domain/reference-repository';
import { ReferenceDoesNotExistsError } from '@modules/shared/references/domain/reference-does-not-exists-error';

import { BookAlreadyExistsError } from '../domain/book-already-exists-error';
import { BookRepository } from '../domain/book-repository';

import { createBookBuilder, CreateBookUseCase } from './create-book';

describe('create book', () => {
  let createBook: CreateBookUseCase;
  let bookRepository: MockProxy<BookRepository>;

  const systemDateTime = faker.date.recent();

  const book = bookFixtures.create({
    createdAt: systemDateTime,
    updatedAt: systemDateTime,
  });

  const existingBook = bookFixtures.create();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    bookRepository = mock<BookRepository>();
    const referenceRepository = mock<ReferenceRepository>();
    const uuidGenerator = mock<UuidGenerator>();

    when(uuidGenerator.generate).mockReturnValue(book.id);

    when(referenceRepository.exists)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith(book.referenceId)
      .mockResolvedValue()
      .calledWith(existingBook.referenceId)
      .mockResolvedValue();

    when(bookRepository.exists)
      .mockImplementation((barcode) => {
        throw BookAlreadyExistsError.withBarCode(barcode);
      })
      .calledWith(book.barcode)
      .mockResolvedValue();

    createBook = createBookBuilder({
      referenceRepository,
      bookRepository,
      uuidGenerator,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError when', () => {
    it('provided with invalid reference id', () => {
      expect(
        createBook({
          ...book,
          referenceId: referenceIdFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided with invalid barcode value', () => {
      expect(
        createBook({
          ...book,
          barcode: barcodeFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided with invalid status', async () => {
      expect(
        createBook({
          ...book,
          status: bookStatusFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw ReferenceDoesNotExists when reference id provided has no corresponding reference', async () => {
    await expect(createBook({ ...book, referenceId: referenceIdFixtures.create() })).rejects.toThrow(
      ReferenceDoesNotExistsError,
    );
  });

  it('should throw BookAlreadyExists when book already exits', async () => {
    await expect(createBook(existingBook)).rejects.toThrow(BookAlreadyExistsError);
  });

  it('should save book', async () => {
    const res = await createBook({
      barcode: book.barcode,
      referenceId: book.referenceId,
      status: book.status,
    });
    expect(res).toEqual(book);
    expect(bookRepository.save).toHaveBeenCalledWith(book);
  });
});
