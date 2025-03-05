import { UserId } from '@modules/shared/users/domain/user-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const userIdFixtures = {
  create(): UserId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
};
