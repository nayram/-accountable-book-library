import { ReferenceId } from '@modules/references/domain/reference/reference-id';
import { uuidFixtures } from '../shared/uuid-fixtures';

export const referenceIdFixtures = {
  create(): ReferenceId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
  invalidPathId() {
    return uuidFixtures.urlInvalid();
  },
};
