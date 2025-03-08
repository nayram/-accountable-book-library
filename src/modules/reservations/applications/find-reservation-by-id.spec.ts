import { mock } from 'jest-mock-extended';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { when } from 'jest-when';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';

import { ReservationRepository } from '../domain/reservation-repository';
import { ReservationDoesNotExistError } from '../domain/reservation-does-not-exist';
import { ReservationId } from '../domain/reservation/reservation-id';

import { findReservationByIdBuilder, FindReservationByIdUseCase } from './find-reservation-by-id';

describe('find reservation by id', () => {
  let findReservationById: FindReservationByIdUseCase;

  const reservation = reservationFixtures.create();

  beforeEach(() => {
    const reservationRepository = mock<ReservationRepository>();

    when(reservationRepository.findById)
      .mockImplementation((id: ReservationId) => {
        throw new ReservationDoesNotExistError(id);
      })
      .calledWith(reservation.id)
      .mockResolvedValue(reservation);

    findReservationById = findReservationByIdBuilder({ reservationRepository });
  });

  it('should throw FieldValidationError when provided invalid referenceId value', () => {
    expect(findReservationById({ id: reservationIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw ReservationDoesNotExistError when provided reseration does not exist', async () => {
    await expect(findReservationById({ id: reservationIdFixtures.create() })).rejects.toThrow(
      ReservationDoesNotExistError,
    );
  });

  it('should successfully return reservation', async () => {
    await expect(findReservationById({ id: reservation.id })).resolves.toEqual(reservation);
  });
});
