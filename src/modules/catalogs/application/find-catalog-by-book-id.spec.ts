import { faker } from '@faker-js/faker/locale/en';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { findCatalogByBookIdBuilder, FindCatalogByBookIdUseCase } from './find-catalog-by-book-id';

describe('find catalog by book id', () => {
  let findCatalogByBookId: FindCatalogByBookIdUseCase;

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
    const bookRepository = mock<BookRepository>();
    when(bookRepository.findById)
      .mockImplementation((id) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith(book.id)
      .mockResolvedValue(book);

    findCatalogByBookId = findCatalogByBookIdBuilder({ bookRepository });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should throw FieldValidationError when provided id is invalid', () => {
    expect(findCatalogByBookId({ id: bookIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw BookDoesNotExistsError when the provided book id has no corresponding book', () => {
    expect(findCatalogByBookId({ id: bookIdFixtures.create() })).rejects.toThrow(BookDoesNotExistsError);
  });

  it('should return book catalog', () => {
    expect(findCatalogByBookId({ id: book.id })).resolves.toEqual(book);
  });
});
