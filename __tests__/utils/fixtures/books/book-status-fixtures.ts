import { faker } from '@faker-js/faker/locale/en';

import { BookStatus } from '@modules/shared/books/domain/book/book-status';

export const bookStatusFixtures = {
  create(): BookStatus {
    return faker.helpers.enumValue(BookStatus);
  },
};
