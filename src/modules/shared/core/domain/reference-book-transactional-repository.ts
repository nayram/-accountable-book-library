import { Reference } from '@modules/shared/references/domain/reference/reference';

export interface ReferenceBookTransactionalRepository {
  save(reference: Reference): Promise<void>;
}
