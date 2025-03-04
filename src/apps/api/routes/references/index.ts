import {
  createReference,
  findReferenceByExternalReferenceId,
  findReferences,
  deleteReferenceById,
} from '@modules/references/application';

import { postCreateReferenceControllerBuilder } from './post-create-reference-controller';
import { getReferenceByReferenceIdControllerBuilder } from './get-reference-by-reference-id-controller';
import { deleteReferenceByIdControllerBuilder } from './delete-reference-by-id-controller';
import { getReferencesControllerBuilder } from './get-references-controller';

export const postCreateReferenceController = postCreateReferenceControllerBuilder({
  createReference,
});
export const getReferenceByReferenceIdController = getReferenceByReferenceIdControllerBuilder({
  findReferenceByExternalReferenceId,
});
export const getReferencesController = getReferencesControllerBuilder({ findReferences });
export const deleteReferenceByIdController = deleteReferenceByIdControllerBuilder({ deleteReferenceById });
