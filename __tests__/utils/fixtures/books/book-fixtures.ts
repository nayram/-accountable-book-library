import { Book } from '@modules/shared/books/domain/book/book';
import { faker } from '@faker-js/faker/locale/en';
import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { toDTO } from '@modules/shared/books/infrastructure/book-dto';

import { referenceIdFixtures } from '../references/reference-id-fixtures';

import { bookIdFixtures } from './book-id-fixtures';
import { bookStatusFixtures } from './book-status-fixtures';

export const bookFixtures = {
  create(book?: Partial<Book>) {
    return {
      ...createBook(),
      ...book,
    };
  },
  createMany({ book, length = 5 }: { book?: Partial<Book>; length?: number }): Book[] {
    return Array.from({ length }, () => this.create(book));
  },

  async insert(book?: Partial<Book>): Promise<Book> {
    const createdBook = this.create(book);
    await bookModel.create(toDTO(createdBook));
    return createdBook;
  },

  async insertMany({ book, length = 5 }: { book?: Partial<Book>; length?: number }): Promise<Book[]> {
    const books = this.createMany({ book, length });
    await bookModel.create(books.map(toDTO));
    return books;
  },
};

function createBook(): Book {
  const date = faker.date.recent();
  return {
    id: bookIdFixtures.create(),
    referenceId: referenceIdFixtures.create(),
    status: bookStatusFixtures.create(),
    createdAt: date,
    updatedAt: date,
  };
}
