import { createBook, getBookById } from '@modules/books/application';

import { postCreateBookControllerBuilder } from './post-create-book-controller';
import { getBookControllerBuilder } from './get-book-controller';

export const postCreateBookController = postCreateBookControllerBuilder({ createBook });
export const getBookController = getBookControllerBuilder({ getBookById });
