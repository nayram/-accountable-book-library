import { faker } from '@faker-js/faker/locale/en'
import { Book } from '@modules/catalogs/domain/book/book'
import { bookIdFixtures } from './book-id-fixtures'
import { titleFixtures } from './title-fixtures'
import { authorFixtures } from './author-fixtures'
import { publicationYearFixtures } from './publication-year-fixtures'
import { publisherFixtures } from './publisher-fixtures'
import { priceFixtures } from './price-fixtures'
import { quantityFixtures } from './quantity-fixtures'

export const bookFixtures = {
  create(book?: Partial<Book>) {
    return {
      ...createBook(),
      ...book,
    }
  },
}

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
  }
}
