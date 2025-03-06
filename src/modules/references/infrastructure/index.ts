import { referenceModel } from '../../shared/references/infrastructure/reference-model';

import { referenceRepositoryBuilder } from './reference-repository';

export const referenceRepository = referenceRepositoryBuilder({ referenceModel });
