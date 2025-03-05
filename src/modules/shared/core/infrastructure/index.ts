import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';

import { referenceBookTransactionalRepositoryBuilder } from './reference-book-transactional-repository';
import { uuidV4Generator } from './uuid-v4-generator';

export const uuidGenerator = uuidV4Generator;
export const referenceBookTransactionalRepository = referenceBookTransactionalRepositoryBuilder({
  bookModel,
  referenceModel,
});
