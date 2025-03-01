import { faker } from '@faker-js/faker/locale/en';

import { Book } from '@modules/catalogs/domain/book/book';
import { bookModel } from '@modules/catalogs/infrastructure/book-model';

import { bookIdFixtures } from './book-id-fixtures';
import { titleFixtures } from './title-fixtures';
import { authorFixtures } from './author-fixtures';
import { publicationYearFixtures } from './publication-year-fixtures';
import { publisherFixtures } from './publisher-fixtures';
import { priceFixtures } from './price-fixtures';
import { quantityFixtures } from './quantity-fixtures';

export const bookFixtures = {
  create(book?: Partial<Book>) {
    return {
      ...createBook(),
      ...book,
    };
  },

  async insert(book?: Partial<Book>) {
    const createdBook = this.create(book);
    await bookModel.create({
      _id: createdBook.id,
      quantity: createdBook.quantity,
      price: createdBook.price,
      author: createdBook.author,
      title: createdBook.title,
      publication_year: createdBook.publicationYear,
      publisher: createdBook.publisher,
      created_at: createdBook.createdAt,
      updated_at: createdBook.updatedAt,
    });
    return createdBook;
  },
};

function createBook(): Book {
  return {
    id: bookIdFixtures.create(),
    title: titleFixtures.create(),
    author: authorFixtures.create(),
    publicationYear: publicationYearFixtures.create(),
    publisher: publisherFixtures.create(),
    price: priceFixtures.create(),
    quantity: quantityFixtures.create(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };
}
