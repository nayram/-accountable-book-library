import { referenceModel } from './repository-model';
import { referenceRepositoryBuilder } from './reference-repository';

export const referenceRepository = referenceRepositoryBuilder({ referenceModel });
