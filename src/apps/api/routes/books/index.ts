import { createBook, getBookById } from '@modules/books/application';

import { postCreateBookControllerBuilder } from './post-create-book-controller';
import { getBookStatusControllerBuilder } from './get-book-status-controller';

export const postCreateBookController = postCreateBookControllerBuilder({ createBook });
export const getBookStatusController = getBookStatusControllerBuilder({ getBookById });
