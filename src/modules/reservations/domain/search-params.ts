import { createReferenceId, ReferenceId } from '@modules/shared/references/domain/reference-id';
import { createUserId, UserId } from '@modules/shared/users/domain/user/user-id';

export type SearchParams = Partial<{
  referenceId: ReferenceId;
  userId: UserId;
}>;

export function createSearchParams({
  referenceId,
  userId,
}: {
  referenceId: string | null;
  userId: string | null;
}): SearchParams {
  const searchParams: SearchParams = {};
  if (referenceId) {
    searchParams.referenceId = createReferenceId(referenceId);
  }

  if (userId) {
    searchParams.userId = createUserId(userId);
  }

  return searchParams;
}
