import { UserId } from './user/user-id';

export interface UserRepository {
  exists(id: UserId): Promise<void>;
}
