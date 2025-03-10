import {
  createReference,
  findReferenceById,
  findReferences,
  deleteReferenceById,
} from '@modules/references/application';

import { postCreateReferenceControllerBuilder } from './post-create-reference-controller';
// eslint-disable-next-line max-len
import { getReferenceByIdControllerBuilder } from './get-reference-by-id-controller';
import { deleteReferenceByIdControllerBuilder } from './delete-reference-by-id-controller';
import { getReferencesControllerBuilder } from './get-references-controller';

export const postCreateReferenceController = postCreateReferenceControllerBuilder({
  createReference,
});
export const getReferenceByIdController = getReferenceByIdControllerBuilder({
  findReferenceById,
});
export const getReferencesController = getReferencesControllerBuilder({ findReferences });
export const deleteReferenceByIdController = deleteReferenceByIdControllerBuilder({ deleteReferenceById });
