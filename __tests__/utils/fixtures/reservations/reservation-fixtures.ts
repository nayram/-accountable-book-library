import { faker } from '@faker-js/faker/locale/en';

import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { reservationModel } from '@modules/reservations/infrastructure/reservation-model';
import { toDTO } from '@modules/reservations/infrastructure/reservation-dto';

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
  async insert(reservation?: Partial<Reservation>): Promise<Reservation> {
    const createdReservation = this.create(reservation);
    await reservationModel.create(toDTO(createdReservation));
    return createdReservation;
  },
  async insertMany({
    reservation,
    length = 5,
  }: {
    reservation?: Partial<Reservation>;
    length?: number;
  }): Promise<Reservation[]> {
    const reservations = this.createMany({ reservation, length });
    await reservationModel.create(reservations.map(toDTO));
    return reservations;
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
