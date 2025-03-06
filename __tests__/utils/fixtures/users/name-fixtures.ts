import { faker } from '@faker-js/faker/locale/en';

export const nameFixtures = {
  create() {
    return faker.person.firstName();
  },
};
