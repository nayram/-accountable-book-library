import { Author, createAuthor } from '@modules/shared/references/domain/author';
import { PublicationYear, createPublicationYear } from '@modules/shared/references/domain/publication-year';
import { Title, createTitle } from '@modules/shared/references/domain/title';

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
  return searchParams;
}
