import { BorrowId } from '@modules/borrows/domain/borrow/borrow-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const borrowIdFixtures = {
  create(): BorrowId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
};
