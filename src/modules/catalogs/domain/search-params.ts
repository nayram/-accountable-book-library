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
  return searchParams;
}
