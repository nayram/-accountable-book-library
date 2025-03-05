import { bookModel } from './book-model';
import { bookRepositoryBuilder } from './book-repository';

export const bookRepository = bookRepositoryBuilder({ model: bookModel });
