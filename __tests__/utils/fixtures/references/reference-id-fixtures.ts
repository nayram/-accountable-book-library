import { faker } from '@faker-js/faker/locale/en';

import { ReferenceId } from '@modules/shared/references/domain/reference-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const referenceIdFixtures = {
  create(): ReferenceId {
    return uuidFixtures.create();
  },
  invalid() {
    const invalidValues = ['1234567', 'random-value', 'abd-adb-basdf'];
    return faker.helpers.arrayElement(invalidValues);
  },
  invalidPathId() {
    return uuidFixtures.urlInvalid();
  },
};
