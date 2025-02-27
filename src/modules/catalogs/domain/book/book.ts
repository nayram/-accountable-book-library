import { Entity } from '@modules/shared/core/domain/entity';

export type Book = Entity<{
    id: string;
    title: string;
}>;
