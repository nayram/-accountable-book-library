import { createBook, findBooks, getBookById } from '@modules/books/application';

import { postCreateBookControllerBuilder } from './post-create-book-controller';
import { getBookControllerBuilder } from './get-book-controller';
import { getBooksControllerBuilder } from './get-books-controller';

export const postCreateBookController = postCreateBookControllerBuilder({ createBook });
export const getBookController = getBookControllerBuilder({ getBookById });
export const getBooksController = getBooksControllerBuilder({ findBooks });
