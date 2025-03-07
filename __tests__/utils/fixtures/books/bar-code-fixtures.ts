import { faker } from '@faker-js/faker/locale/en';

export const barcodeFixtures = {
  create() {
    return faker.string.alphanumeric(12);
  },
  invalid() {
    return faker.string.alphanumeric({ length: { max: 11, min: 5 } });
  },
};
