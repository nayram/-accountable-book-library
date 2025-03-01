import { faker } from '@faker-js/faker/locale/en';

import { Author } from '@modules/catalogs/domain/book/author';

export const authorFixtures = {
  create(): Author {
    return faker.book.author();
  },
  invalid(): Author {
    const invalidValues = ['', ' '];
    return faker.helpers.arrayElement(invalidValues) as unknown as Author;
  },
};
