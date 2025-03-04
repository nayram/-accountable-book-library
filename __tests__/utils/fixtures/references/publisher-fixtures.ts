import { faker } from '@faker-js/faker/locale/en';
import { Publisher } from '@modules/references/domain/reference/publisher';

export const publisherFixtures = {
  create(): Publisher {
    return faker.book.publisher();
  },
  invalid(): Publisher {
    const invalidValues = ['', ' '];
    return faker.helpers.arrayElement(invalidValues);
  },
};
