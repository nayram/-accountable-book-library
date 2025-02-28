import { faker } from '@faker-js/faker/locale/en';
import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export const uuidFixtures = {
  create(): Uuid {
    return createUuid(faker.string.uuid(), 'field');
  },

  invalid() {
    const invalidValues = ['', '1234567', 'random-value', 'abd-adb-basdf'];
    return faker.helpers.arrayElement(invalidValues);
  },

  urlInvalid() {
    const invalidValues = ['1234567', 'random-value', 'abd-adb-basdf'];
    return faker.helpers.arrayElement(invalidValues);
  }
};
