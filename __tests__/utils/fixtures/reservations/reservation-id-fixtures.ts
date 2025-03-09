import { ReservationId } from '@modules/reservations/domain/reservation/reservation-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const reservationIdFixtures = {
  create(): ReservationId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
  urlInvalid() {
    return uuidFixtures.urlInvalid();
  },
};
