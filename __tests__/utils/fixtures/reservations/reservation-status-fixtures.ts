import { faker } from '@faker-js/faker/locale/en';

import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';

export const reservationStatusFixtures = {
  create(): ReservationStatus {
    return faker.helpers.enumValue(ReservationStatus);
  },
  invalid() {
    return faker.helpers.arrayElement(['N/A', 'UnAvailable']);
  },
};
