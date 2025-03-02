import { mock, MockProxy } from 'jest-mock-extended';
import { publicationYearFixtures } from '@tests/utils/fixtures/catalog/publication-year-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/catalog/author-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/catalog/title-fixtures';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { uuidFixtures } from '@tests/utils/fixtures/shared/uuid-fixtures';

import { BookRepository } from '../domain/book-repository';

import { findCatalogsBuilder, FindCatalogsUseCase } from './find-catalogs';

describe('find catalogs', () => {
  let findCatalogs: FindCatalogsUseCase;
  let bookRepository: MockProxy<BookRepository>;

  const publicationYear = publicationYearFixtures.create();
  const author = authorFixtures.create();
  const title = titleFixtures.create();
  const cursor = uuidFixtures.create();
  const limit = 5;

  beforeEach(() => {
    bookRepository = mock<BookRepository>();
    findCatalogs = findCatalogsBuilder({ bookRepository });
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid author value', () => {
      expect(findCatalogs({ cursor, limit, author: authorFixtures.invalid(), title, publicationYear })).rejects.toThrow(
        FieldValidationError,
      );
    });

    it('provided invalid publicationYear value', () => {
      expect(
        findCatalogs({ cursor, limit, publicationYear: publicationYearFixtures.invalid(), title, author }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid title valie', () => {
      expect(findCatalogs({ cursor, limit, title: titleFixtures.invalid(), author, publicationYear })).rejects.toThrow(
        FieldValidationError,
      );
    });

    it('provided invalid cursor value', () => {
      expect(findCatalogs({ cursor: uuidFixtures.invalid(), limit, title, author, publicationYear })).rejects.toThrow(
        FieldValidationError,
      );
    });

    it('provided invalid limit value', () => {
      expect(findCatalogs({ cursor, limit: '2' as unknown as number, title, author, publicationYear })).rejects.toThrow(
        FieldValidationError,
      );
    });
  });

  it('should successfully search through catalogs', async () => {
    const pagination = { cursor, limit };
    const searchParams = { title, author, publicationYear };
    await findCatalogs({ cursor, limit, title, author, publicationYear });
    expect(bookRepository.find).toHaveBeenCalledWith(pagination, searchParams);
  });
});
