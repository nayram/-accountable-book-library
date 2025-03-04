import { faker } from '@faker-js/faker/locale/en';
import { Title } from '@modules/references/domain/reference/title';

export const titleFixtures = {
  create(): Title {
    return faker.book.title();
  },
  invalid(): Title {
    const invalidValues = [' ', ''];
    return faker.helpers.arrayElement(invalidValues);
  },
};
