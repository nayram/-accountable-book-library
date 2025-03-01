import { bookRepositoryBuilder } from './book-repository';
import { bookModel } from './book-model';

export const bookRepository = bookRepositoryBuilder({ model: bookModel });
