import { faker } from '@faker-js/faker/locale/en';

import { Reservation } from '@modules/reservations/domain/reservation/reservation';

import { userIdFixtures } from '../users/user-id-fixtures';
import { referenceIdFixtures } from '../references/reference-id-fixtures';
import { bookIdFixtures } from '../books/book-id-fixtures';

import { reservationIdFixtures } from './reservation-id-fixtures';

export const reservationFixtures = {
  create(reservation?: Partial<Reservation>) {
    return {
      ...createReservation(),
      ...reservation,
    };
  },
  createMany({ reservation, length = 5 }: { reservation?: Partial<Reservation>; length?: number }) {
    return Array.from({ length }, () => this.create(reservation));
  },
};

function createReservation(): Reservation {
  return {
    id: reservationIdFixtures.create(),
    userId: userIdFixtures.create(),
    referenceId: referenceIdFixtures.create(),
    bookId: bookIdFixtures.create(),
    reservedAt: faker.date.recent(),
  };
}
