import { faker } from '@faker-js/faker/locale/en';

import { ReferenceId } from '@modules/catalogs/domain/book/reference-id';

export const referenceIdFixtures = {
  create(): ReferenceId {
    return faker.string.alphanumeric({ length: { min: 5, max: 10 } });
  },
  invalid(): ReferenceId {
    const invalidValues = ['123', ''];
    return faker.helpers.arrayElement(invalidValues);
  },
};
