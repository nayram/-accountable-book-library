import { Author, createAuthor } from './reference/author';
import { PublicationYear, createPublicationYear } from './reference/publication-year';
import { Title, createTitle } from './reference/title';

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
