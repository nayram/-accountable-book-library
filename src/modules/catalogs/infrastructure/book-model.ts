import mongoose, { Schema, Document } from 'mongoose';

export interface BookDTO extends Document {
  _id: Schema.Types.UUID;
  reference_id: string;
  title: string;
  author: string;
  publication_year: number;
  publisher: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export const bookSchema = new Schema<BookDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  reference_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publication_year: { type: Number, required: true },
  publisher: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const bookModel = mongoose.model<BookDTO>('Book', bookSchema);

export type BookModel = typeof bookModel;
