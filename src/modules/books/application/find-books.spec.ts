import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { BookRepository } from '../domain/book-repository';

import { findBooksBuilder, FindBooksUseCase } from './find-books';

describe('find books', () => {
  let findBooks: FindBooksUseCase;
  const referenceId = referenceIdFixtures.create();

  const books = bookFixtures.createMany({ book: { referenceId } });

  beforeEach(() => {
    const bookRepository = mock<BookRepository>();

    when(bookRepository.find).calledWith({ referenceId }).mockResolvedValue(books);

    findBooks = findBooksBuilder({ bookRepository });
  });

  it('should throw FieldValidationError when reference id is not valid', () => {
    expect(findBooks({ referenceId: referenceIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should return books successfully', async () => {
    await expect(findBooks({ referenceId })).resolves.toEqual(books);
  });
});
