import { faker } from '@faker-js/faker/locale/en';
import { Author } from '@modules/references/domain/reference/author';

export const authorFixtures = {
  create(): Author {
    return faker.book.author();
  },
  invalid(): Author {
    const invalidValues = [''];
    return faker.helpers.arrayElement(invalidValues);
  },
};
