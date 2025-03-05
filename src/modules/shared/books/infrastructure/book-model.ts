import mongoose, { Schema } from 'mongoose';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';

import { BookStatus } from '../domain/book-status';

export interface BookDTO {
  _id: Schema.Types.UUID;
  reference_id: Schema.Types.UUID;
  status: BookStatus;
  created_at: Date;
  updated_at: Date;
}

export const bookSchema = new Schema<BookDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  reference_id: { type: Schema.Types.UUID, required: true, ref: referenceModel },
  status: { enum: BookStatus, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const bookModel = mongoose.model<BookDTO>('Book', bookSchema);

export type BookModel = typeof bookModel;
