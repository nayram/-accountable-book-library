import { ReferenceId } from '@modules/shared/references/domain/reference-id';

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
