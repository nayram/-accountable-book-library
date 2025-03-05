import { faker } from '@faker-js/faker/locale/en';

import { ExternalReferenceId } from '@modules/shared/references/domain/external-reference-id';

export const externalReferenceIdFixtures = {
  create(): ExternalReferenceId {
    return faker.string.alphanumeric({ length: { min: 5, max: 10 } });
  },
  invalid(): ExternalReferenceId {
    const invalidValues = ['123'];
    return faker.helpers.arrayElement(invalidValues);
  },
};
