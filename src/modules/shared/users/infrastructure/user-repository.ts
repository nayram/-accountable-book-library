import { UserDoesNotExistsError } from '../domain/user-does-not-exists-error';
import { UserRepository } from '../domain/user-repository';

import { UserModel } from './users-model';

export function userRepositoryBuilder({ model }: { model: UserModel }): UserRepository {
  return {
    async exists(id) {
      const user = await model.findById(id);
      if (!user) {
        throw new UserDoesNotExistsError(id);
      }
    },
  };
}
