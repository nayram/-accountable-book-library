import { User } from './user/user';
import { UserId } from './user/user-id';

export interface UserRepository {
  exists(id: UserId): Promise<void>;
  findById(id: UserId): Promise<User>;
}
