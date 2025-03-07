import { referenceRepository } from '@modules/shared/references/infrastructure';
import { uuidGenerator } from '@modules/shared/core/infrastructure';

import { bookRepository } from '../infrastructure';

import { createBookBuilder } from './create-book';
import { getBookStatusBuilder } from './get-book-status';

export const createBook = createBookBuilder({ bookRepository, uuidGenerator, referenceRepository });
export const getBookStatus = getBookStatusBuilder({ bookRepository });
