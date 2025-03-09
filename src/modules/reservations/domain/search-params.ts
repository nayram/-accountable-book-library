import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';

import { createReservationStatus, ReservationStatus } from './reservation/reservation-status';

export type SearchParams = Partial<{
  referenceId: ReferenceId;
  userId: UserId;
  status: ReservationStatus;
}>;

export function createSearchParams({
  referenceId,
  userId,
  status,
}: {
  referenceId: string | null;
  userId: string | null;
  status: string | null;
}): SearchParams {
  const searchParams: SearchParams = {};
  if (referenceId) {
    searchParams.referenceId = createReferenceId(referenceId);
  }

  if (userId) {
    searchParams.userId = createUserId(userId);
  }

  if (status) {
    searchParams.status = createReservationStatus(status);
  }

  return searchParams;
}
