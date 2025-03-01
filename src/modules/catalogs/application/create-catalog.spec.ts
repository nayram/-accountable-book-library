import { faker } from '@faker-js/faker/locale/en';
import { when } from 'jest-when';
import { mock, MockProxy } from 'jest-mock-extended';

import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/catalog/title-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/catalog/author-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/catalog/publication-year-fixtures';
import { publisherFixtures } from '@tests/utils/fixtures/catalog/publisher-fixtures';
import { priceFixtures } from '@tests/utils/fixtures/catalog/price-fixtures';
import { quantityFixtures } from '@tests/utils/fixtures/catalog/quantity-fixtures';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';
import { BookAlreadyExistsError } from '../domain/book-already-exists-error';

import { createCatalogBuilder, CreateCatalogUseCase } from './create-catalog';

describe('create catalog', () => {
  let createCatalog: CreateCatalogUseCase;
  let bookRepository: MockProxy<BookRepository>;

  const systemDateTime = faker.date.recent();

  const book = bookFixtures.create({
    createdAt: systemDateTime,
    updatedAt: systemDateTime,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    bookRepository = mock<BookRepository>();
    const uuidGenerator = mock<UuidGenerator>();

    when(uuidGenerator.generate).mockReturnValue(book.id);

    when(bookRepository.exits).calledWith(book).mockResolvedValueOnce(false).mockReturnValue(true);

    createCatalog = createCatalogBuilder({
      bookRepository,
      uuidGenerator,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid title value', () => {
      expect(
        createCatalog({
          ...book,
          title: titleFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid author value', () => {
      expect(
        createCatalog({
          ...book,
          author: authorFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid publication year value', () => {
      expect(
        createCatalog({
          ...book,
          publicationYear: publicationYearFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid publisher value', () => {
      expect(
        createCatalog({
          ...book,
          publisher: publisherFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid price value', () => {
      expect(
        createCatalog({
          ...book,
          price: priceFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid quantity value', () => {
      expect(
        createCatalog({
          ...book,
          quantity: quantityFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw BookAlreadyExistsError when the same book is provided more than once', async () => {
    await createCatalog(book);
    expect(createCatalog(book)).rejects.toThrow(BookAlreadyExistsError);
  });

  it('should save the book', async () => {
    await expect(createCatalog(book)).resolves.toEqual(book);
    expect(bookRepository.save).toHaveBeenCalledWith(book);
  });
});
