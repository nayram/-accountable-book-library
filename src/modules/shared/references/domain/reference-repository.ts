import { ReferenceId } from './reference-id';

export interface ReferenceRepository {
  exists(id: ReferenceId): Promise<void>;
}
