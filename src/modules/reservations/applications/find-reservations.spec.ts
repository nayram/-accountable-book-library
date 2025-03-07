import { mock, MockProxy } from 'jest-mock-extended';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { cursorFixtures } from '@tests/utils/fixtures/shared/cursor-fixtures';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

import { ReservationRepository } from '../domain/reservation-repository';

import { findReservationsBuilder, FindReservationsUseCase } from './find-reservations';

describe('find reservations', () => {
  let findReservations: FindReservationsUseCase;
  let reservationRepository: MockProxy<ReservationRepository>;

  const userId = userIdFixtures.create();
  const referenceId = referenceIdFixtures.create();
  const cursor = cursorFixtures.create();
  const limit = 5;

  beforeEach(() => {
    reservationRepository = mock<ReservationRepository>();
    findReservations = findReservationsBuilder({ reservationRepository });
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid userId value', () => {
      expect(
        findReservations({
          cursor,
          limit,
          userId: userIdFixtures.invalid(),
          referenceId,
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid referenceId value', () => {
      expect(
        findReservations({
          cursor,
          limit,
          referenceId: referenceIdFixtures.invalid(),
          userId,
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid cursor value', () => {
      expect(
        findReservations({
          cursor: cursorFixtures.invalid(),
          limit,
          referenceId,
          userId,
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should successfully return book reservation history', async () => {
    const pagination = { cursor, limit, sortOrder: 'desc', sortBy: 'reservedAt' };
    const searchParams = { referenceId, userId };
    await findReservations({ cursor, limit, userId, referenceId });
    expect(reservationRepository.find).toHaveBeenCalledWith(pagination, searchParams);
  });
});
