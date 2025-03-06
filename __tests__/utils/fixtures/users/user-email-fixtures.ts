import { faker } from '@faker-js/faker/locale/en';

export const userEmailFixtures = {
  create() {
    return faker.internet.email().toLocaleLowerCase();
  },
  invalid() {
    const invalidEmails = [
      '@',
      'john.doe@',
      '@accountable.io',
      'john.doe@accountable',
      'john.doe@accountable.',
      'john.doe@@accountable.com',
      'john.doe@foo@accountable.com',
    ];
    return faker.helpers.arrayElements(invalidEmails);
  },
};
