import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';

import { referenceBookRepositoryBuilder } from './reference-book-repository';
import { uuidV4Generator } from './uuid-v4-generator';

export const uuidGenerator = uuidV4Generator;
export const referenceBookRepository = referenceBookRepositoryBuilder({
  bookModel,
  referenceModel,
});
