import { mock } from 'jest-mock-extended';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { when } from 'jest-when';
import { bookIdFixtures } from '@tests/utils/fixtures/books/book-id-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { getBookByIdBuilder, GetBookByIdUseCase } from './get-book-by-Id';

describe('get book by id', () => {
  let getBookById: GetBookByIdUseCase;
  const book = bookFixtures.create();

  beforeEach(() => {
    const bookRepository = mock<BookRepository>();
    when(bookRepository.findById)
      .mockImplementation((id) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith(book.id)
      .mockResolvedValue(book);

    getBookById = getBookByIdBuilder({ bookRepository });
  });

  it('should throw FieldValidationError when invalid book id is provided', () => {
    expect(getBookById({ id: bookIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw BookDoesNotExistError when provided book id does not have a corresponding book', async () => {
    await expect(getBookById({ id: bookIdFixtures.create() })).rejects.toThrow(BookDoesNotExistsError);
  });

  it('should return book', async () => {
    await expect(getBookById({ id: book.id })).resolves.toEqual(book);
  });
});
