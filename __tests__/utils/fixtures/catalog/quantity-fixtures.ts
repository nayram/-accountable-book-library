import { faker } from '@faker-js/faker/locale/en';

import { Quantity } from '@modules/catalogs/domain/book/quantity';

export const quantityFixtures = {
  create(): Quantity {
    return faker.number.int({ min: 1, max: 4 });
  },
  invalid(): Quantity {
    const invalidValues = ['', 'abc', -19];
    return faker.helpers.arrayElement(invalidValues) as unknown as Quantity;
  },
};
