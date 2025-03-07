import { bookModel } from '@modules/shared/books/infrastructure/book-model';

import { bookRepositoryBuilder } from './book-repository';

export const bookRepository = bookRepositoryBuilder({ model: bookModel });
