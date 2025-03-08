import { referenceRepository } from '@modules/shared/references/infrastructure';
import { uuidGenerator } from '@modules/shared/core/infrastructure';

import { bookRepository } from '../infrastructure';

import { createBookBuilder } from './create-book';
import { getBookByIdBuilder } from './get-book-by-Id';

export const createBook = createBookBuilder({ bookRepository, uuidGenerator, referenceRepository });
export const getBookById = getBookByIdBuilder({ bookRepository });
