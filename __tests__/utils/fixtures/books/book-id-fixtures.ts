import { BookId } from '@modules/shared/books/domain/book-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const bookIdFixtures = {
  create(): BookId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
};
