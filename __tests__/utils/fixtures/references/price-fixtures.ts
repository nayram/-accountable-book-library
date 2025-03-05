import { faker } from '@faker-js/faker/locale/en';
import { Price } from '@modules/shared/references/domain/reference/price';

export const priceFixtures = {
  create(): Price {
    return parseInt(faker.commerce.price({ dec: 0 }));
  },
  invalid(): Price {
    const invalidValues = ['', ' ', -19];
    return faker.helpers.arrayElement(invalidValues) as unknown as Price;
  },
};
