import { Uuid } from './value-objects/uuid';

export interface UuidGenerator {
  generate(): Uuid;
}
