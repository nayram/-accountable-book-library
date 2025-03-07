import { faker } from '@faker-js/faker/locale/en';

import { UserId } from '@modules/shared/users/domain/user/user-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const userIdFixtures = {
  create(): UserId {
    return uuidFixtures.create();
  },
  invalid() {
    const invalidValues = ['1234567', 'random-value', 'abd-adb-basdf'];
    return faker.helpers.arrayElement(invalidValues);
  },
};
