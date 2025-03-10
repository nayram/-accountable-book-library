import { faker } from '@faker-js/faker/locale/en';
import config from 'config';

import { Reservation } from '@modules/reservations/domain/reservation/reservation';
import { reservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { toDTO } from '@modules/reservations/infrastructure/reservation-dto';
import { Money } from '@modules/shared/core/domain/value-objects/money';
import { convertISOToDateString } from '@modules/shared/core/domain/value-objects/iso-date';

import { userIdFixtures } from '../users/user-id-fixtures';
import { referenceIdFixtures } from '../references/reference-id-fixtures';
import { bookIdFixtures } from '../books/book-id-fixtures';

import { reservationIdFixtures } from './reservation-id-fixtures';
import { reservationStatusFixtures } from './reservation-status-fixtures';

const lateFee = config.get<Money>('lateFee');
const reservationFee = config.get<Money>('reservationFee');

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
  const date = faker.date.recent();
  const dueAtDate = faker.date.soon({ days: 7, refDate: date });
  const dueAt = faker.helpers.arrayElement([null, convertISOToDateString(dueAtDate)]);
  return {
    id: reservationIdFixtures.create(),
    userId: userIdFixtures.create(),
    referenceId: referenceIdFixtures.create(),
    bookId: bookIdFixtures.create(),
    status: reservationStatusFixtures.create(),
    reservedAt: date,
    borrowedAt: faker.helpers.arrayElement([null, date]),
    lateFee: faker.helpers.arrayElement([0, lateFee]),
    reservationFee,
    dueAt,
    returnedAt: dueAt,
  };
}
