import { uuidGenerator } from '@modules/shared/core/infrastructure/';

import { referenceRepository } from '../infrastructure';

import { createReferenceBuilder } from './create-reference';
import { findReferenceByIdBuilder } from './find-reference-by-id';
import { deleteReferenceByIdBuilder } from './delete-reference-by-id';
import { findReferencesBuilder } from './find-references';

export const createReference = createReferenceBuilder({
  referenceRepository,
  uuidGenerator,
});
export const findReferenceById = findReferenceByIdBuilder({ referenceRepository });
export const deleteReferenceById = deleteReferenceByIdBuilder({ referenceRepository });
export const findReferences = findReferencesBuilder({ referenceRepository });
