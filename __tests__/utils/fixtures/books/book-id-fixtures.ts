import { faker } from '@faker-js/faker/locale/en';

import { BookId } from '@modules/shared/books/domain/book/book-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const bookIdFixtures = {
  create(): BookId {
    return uuidFixtures.create();
  },
  invalid() {
    const invalidValues = ['1234567', 'random-value', 'abd-adb-basdf'];
    return faker.helpers.arrayElement(invalidValues);
  },
};
