import { UserId } from './user/user-id';

export class UserDoesNotExistsError extends Error {
  constructor(id: UserId) {
    super(`user with id ${id} does not exist`);
    this.name = 'UserDoesNotExistsError';
  }
}
