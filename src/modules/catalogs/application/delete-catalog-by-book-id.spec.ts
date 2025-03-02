import { mock, MockProxy } from 'jest-mock-extended';
import { when } from 'jest-when';

import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures';
import { bookIdFixtures } from '@tests/utils/fixtures/catalog/book-id-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { deleteCatalogByBookIdBuilder, DeleteCatalogByBookIdUseCase } from './delete-catalog-by-book-id';

describe('delete catalog by book id', () => {
  let deleteCatalogByBookId: DeleteCatalogByBookIdUseCase;
  let bookRepository: MockProxy<BookRepository>;

  const book = bookFixtures.create();

  beforeEach(() => {
    bookRepository = mock<BookRepository>();
    when(bookRepository.deleteById)
      .mockImplementation((id) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith(book.id)
      .mockResolvedValue();

    deleteCatalogByBookId = deleteCatalogByBookIdBuilder({ bookRepository });
  });

  it('should throw FieldValidationError when provided id is invalid', () => {
    expect(deleteCatalogByBookId({ id: bookIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw BookDoesNotExistsError when the provided book id has no corresponding book', () => {
    expect(deleteCatalogByBookId({ id: bookIdFixtures.create() })).rejects.toThrow(BookDoesNotExistsError);
  });

  it('should return book catalog', async () => {
    await deleteCatalogByBookId({ id: book.id });
    expect(bookRepository.deleteById).toHaveBeenCalledWith(book.id);
  });
});
