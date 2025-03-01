import { BookId } from '@modules/catalogs/domain/book/book-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const bookIdFixtures = {
  create(): BookId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
};
