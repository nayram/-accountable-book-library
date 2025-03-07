import { uuidGenerator } from '@modules/shared/core/infrastructure/';

import { referenceRepository } from '../infrastructure';

import { createReferenceBuilder } from './create-reference';
import { findReferenceByExternalReferenceIdBuilder } from './find-reference-by-external-reference-id';
import { deleteReferenceByIdBuilder } from './delete-reference-by-id';
import { findReferencesBuilder } from './find-references';

export const createReference = createReferenceBuilder({
  referenceRepository,
  uuidGenerator,
});
export const findReferenceByExternalReferenceId = findReferenceByExternalReferenceIdBuilder({ referenceRepository });
export const deleteReferenceById = deleteReferenceByIdBuilder({ referenceRepository });
export const findReferences = findReferencesBuilder({ referenceRepository });
