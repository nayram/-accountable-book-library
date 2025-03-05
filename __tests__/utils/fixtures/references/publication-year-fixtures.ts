import { faker } from '@faker-js/faker/locale/en';

import { PublicationYear } from '@modules/shared/references/domain/publication-year';

export const publicationYearFixtures = {
  create(): PublicationYear {
    return faker.date.past().getFullYear();
  },
  invalid(): PublicationYear {
    const invalidValues = ['abcd'];
    return faker.helpers.arrayElement(invalidValues) as unknown as PublicationYear;
  },
};
