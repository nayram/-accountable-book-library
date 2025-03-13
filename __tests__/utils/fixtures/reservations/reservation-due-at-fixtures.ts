import { faker } from '@faker-js/faker/locale/en';

import { convertDateToISODateString } from '@modules/shared/core/domain/value-objects/iso-date';

export const reservationDueAtFixtures = {
  create() {
    return convertDateToISODateString(faker.date.recent());
  },

  invalid() {
    return faker.helpers.arrayElement(['2023 11 01', '2023/11/01']);
  },
};
