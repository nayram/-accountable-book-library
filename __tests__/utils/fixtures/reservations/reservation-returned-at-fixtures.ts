import { faker } from '@faker-js/faker/locale/en';

import { convertISOToDateString } from '@modules/shared/core/domain/value-objects/iso-date';

export const reservationReturnedAtFixtures = {
  create() {
    return convertISOToDateString(faker.date.recent());
  },

  invalid() {
    return faker.helpers.arrayElement(['2024-01-01 00:00:00', '2024-01-01T00:00:00.000Z', '2023 11 01', '2023/11/01']);
  },
};
