import { Entity } from '@modules/shared/core/domain/entity';

import { UserId } from './user-id';
import { Name } from './name';
import { UserEmail } from './user-email';

export type User = Entity<{
  id: UserId;
  name: Name;
  email: UserEmail;
  createdAt: Date;
  updatedAt: Date;
}>;
