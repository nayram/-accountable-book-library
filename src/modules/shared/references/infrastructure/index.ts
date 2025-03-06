import { referenceModel } from './reference-model';
import { referenceRepositoryBuilder } from './reference-repository';

export const referenceRepository = referenceRepositoryBuilder({ model: referenceModel });
