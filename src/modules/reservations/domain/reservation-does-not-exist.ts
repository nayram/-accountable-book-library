import { ReservationId } from './reservation/reservation-id';

export class ReservationDoesNotExistError extends Error {
  constructor(id: ReservationId) {
    super(`reservation with id ${id} does not exist`);
    this.name = 'ReservationDoesNotError';
  }
}
