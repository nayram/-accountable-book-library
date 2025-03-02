import { faker } from '@faker-js/faker/locale/en';

import { Title } from '@modules/catalogs/domain/book/title';

export const titleFixtures = {
  create(): Title {
    return faker.book.title();
  },
  invalid(): Title {
    const invalidValues = [' ', '', 123];
    return faker.helpers.arrayElement(invalidValues) as unknown as Title;
  },
};
