import { mock } from 'jest-mock-extended';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { when } from 'jest-when';
import { bookIdFixtures } from '@tests/utils/fixtures/books/book-id-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';
import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';

import { getBookStatusBuilder, GetBookStatusUseCase } from './get-book-status';

describe('get book status', () => {
  let getBookStatus: GetBookStatusUseCase;
  const book = bookFixtures.create();

  beforeEach(() => {
    const bookRepository = mock<BookRepository>();
    when(bookRepository.findById)
      .mockImplementation((id) => {
        throw new BookDoesNotExistsError(id);
      })
      .calledWith(book.id)
      .mockResolvedValue(book);

    getBookStatus = getBookStatusBuilder({ bookRepository });
  });

  it('should throw FieldValidationError when invalid book id is provided', () => {
    expect(getBookStatus({ id: bookIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw BookDoesNotExistError when provided book id does not have a corresponding book', async () => {
    await expect(getBookStatus({ id: bookIdFixtures.create() })).rejects.toThrow(BookDoesNotExistsError);
  });

  it('should return book status', async () => {
    const { status } = await getBookStatus({ id: book.id });
    expect(status).toBe(book.status);
  });
});
