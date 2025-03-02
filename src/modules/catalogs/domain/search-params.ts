import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { Author, createAuthor } from './book/author';
import { createPublicationYear, PublicationYear } from './book/publication-year';
import { createTitle, Title } from './book/title';

export type SearchParams = Partial<{
  publicationYear: PublicationYear;
  author: Author;
  title: Title;
}>;

export function createSearchParams({
  publicationYear,
  author,
  title,
}: {
  publicationYear: number | null;
  author: string | null;
  title: string | null;
}): SearchParams {
  const searchParams: SearchParams = {};
  if (author) {
    searchParams.author = createAuthor(author);
  }
  if (title) {
    searchParams.title = createTitle(title);
  }

  if (publicationYear) {
    searchParams.publicationYear = createPublicationYear(publicationYear);
  }
  if (!searchParams) {
    throw new FieldValidationError(`search paramaters should have at least author, title or publicationYear`);
  }
  return searchParams;
}
