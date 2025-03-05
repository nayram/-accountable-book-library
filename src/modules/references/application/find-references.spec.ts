import { mock, MockProxy } from 'jest-mock-extended';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { cursorFixtures } from '@tests/utils/fixtures/shared/cursor-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/references/publication-year-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';

import { ReferenceRepository } from '../domain/reference-repository';

import { findReferencesBuilder, FindReferencesUseCase } from './find-references';

describe('find references', () => {
  let findReferences: FindReferencesUseCase;
  let referenceRepository: MockProxy<ReferenceRepository>;

  const publicationYear = publicationYearFixtures.create();
  const author = authorFixtures.create();
  const title = titleFixtures.create();
  const cursor = cursorFixtures.create();
  const limit = 5;

  beforeEach(() => {
    referenceRepository = mock<ReferenceRepository>();
    findReferences = findReferencesBuilder({ referenceRepository });
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid publicationYear value', () => {
      expect(
        findReferences({
          cursor,
          limit,
          publicationYear: publicationYearFixtures.invalid(),
          title,
          author,
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid cursor value', () => {
      expect(
        findReferences({
          cursor: cursorFixtures.invalid(),
          limit,
          title,
          author,
          publicationYear,
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should successfully search through references', async () => {
    const pagination = { cursor, limit, sortOrder: 'desc', sortBy: 'createdAt' };
    const searchParams = { title, author, publicationYear };
    await findReferences({ cursor, limit, title, author, publicationYear });
    expect(referenceRepository.find).toHaveBeenCalledWith(pagination, searchParams);
  });
});
