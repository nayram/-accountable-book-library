import { Schema } from 'mongoose';

import { User } from '../domain/user/user';

import { UserDTO } from './users-model';

export function toDTO(user: User): UserDTO {
  return {
    _id: user.id as unknown as Schema.Types.UUID,
    name: user.name,
    email: user.email,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

export function fromDTO(dto: UserDTO): User {
  return {
    id: String(dto._id),
    name: dto.name,
    email: dto.email,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
