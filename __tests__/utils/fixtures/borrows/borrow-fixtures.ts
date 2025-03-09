import { faker } from '@faker-js/faker/locale/en';
import { Borrow } from '@modules/borrows/domain/borrow/borrow';

import { userIdFixtures } from '../users/user-id-fixtures';
import { bookIdFixtures } from '../books/book-id-fixtures';

import { borrowIdFixtures } from './borrow-id-fixtures';

export const borrowFixtures = {
  create(borrow?: Partial<Borrow>) {
    return {
      ...createBorrow(),
      ...borrow,
    };
  },
  createMany({ borrow, length = 5 }: { borrow?: Partial<Borrow>; length?: number }): Borrow[] {
    return Array.from({ length }, () => this.create(borrow));
  },
};

function createBorrow(): Borrow {
  const borrowDate = faker.date.recent();
  return {
    id: borrowIdFixtures.create(),
    userId: userIdFixtures.create(),
    bookId: bookIdFixtures.create(),
    borrowDate,
    dueDate: faker.date.soon({ days: 3, refDate: borrowDate }),
    returnDate: faker.date.soon({ days: 3, refDate: borrowDate }),
    updatedAt: borrowDate,
  };
}
