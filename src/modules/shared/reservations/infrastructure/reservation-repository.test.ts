import { reservationIdFixtures } from '@tests/utils/fixtures/reservations/reservation-id-fixtures';
import { ReservationDoesNotExistError } from '@modules/shared/reservations/domain/reservation-does-not-exist';
import { reservationFixtures } from '@tests/utils/fixtures/reservations/reservation-fixtures';

import { reservationRepository } from '.';

describe('reservationRepository', () => {
  describe('exists', () => {
    it('should throw ReservationDoesNotExistError if reservation does not exist', async () => {
      const id = reservationIdFixtures.create();
      await expect(reservationRepository.exists(id)).rejects.toThrow(ReservationDoesNotExistError);
    });
    it('should resolve successfully if reservation exits', async () => {
      const reservation = await reservationFixtures.insert();
      await expect(reservationRepository.exists(reservation.id)).resolves.toBeUndefined();
    });
  });
});
