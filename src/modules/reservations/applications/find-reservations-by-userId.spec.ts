import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';

import { ReservationRepository } from '../domain/reservation-repository';

import { findReservationsByUserIdBuilder, FindReservationsByUserIdUseCase } from './find-reservations-by-userId';

describe('find reservations by user id', () => {
  let findReservationsByUserId: FindReservationsByUserIdUseCase;

  const userId = userIdFixtures.create();
  const reservations = reservationFixtures.createMany({ reservation: { userId } });

  beforeEach(() => {
    const reservationRepository = mock<ReservationRepository>();

    when(reservationRepository.findBySearchParams)
      .mockResolvedValue([])
      .calledWith({ userId })
      .mockResolvedValue(reservations);

    findReservationsByUserId = findReservationsByUserIdBuilder({ reservationRepository });
  });

  it('should throw FieldValidationError when provided invalid user id value', () => {
    expect(findReservationsByUserId({ userId: userIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should successfully return reservations', async () => {
    await expect(findReservationsByUserId({ userId })).resolves.toEqual(reservations);
  });
});
