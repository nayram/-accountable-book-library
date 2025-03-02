import { Book } from '@modules/catalogs/domain/book/book';

export interface CatalogDTO {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  price: number;
}

export function toDTO(book: Book): CatalogDTO {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publicationYear: book.publicationYear,
    price: book.price,
  };
}
