import { faker } from '@faker-js/faker/locale/en';

import { User } from '@modules/shared/users/domain/user/user';
import { userModel } from '@modules/shared/users/infrastructure/users-model';
import { toDTO } from '@modules/shared/users/infrastructure/user-dto';

import { userIdFixtures } from './user-id-fixtures';
import { nameFixtures } from './name-fixtures';
import { userEmailFixtures } from './user-email-fixtures';

export const userFixtures = {
  create(user?: Partial<User>): User {
    return {
      ...createUser(),
      ...user,
    };
  },
  createMany({ user, length = 5 }: { user?: Partial<User>; length?: number }) {
    return Array.from({ length }, () => this.create(user));
  },

  async insert(user?: Partial<User>): Promise<User> {
    const createdUser = this.create(user);
    await userModel.create(toDTO(createdUser));
    return createdUser;
  },
  async insertMany({ user, length = 5 }: { user?: Partial<User>; length?: number }): Promise<User[]> {
    const users = this.createMany({ user, length });
    await userModel.create(users.map(toDTO));
    return users;
  },
};

function createUser(): User {
  const date = faker.date.recent();
  return {
    id: userIdFixtures.create(),
    name: nameFixtures.create(),
    email: userEmailFixtures.create(),
    createdAt: date,
    updatedAt: date,
  };
}
