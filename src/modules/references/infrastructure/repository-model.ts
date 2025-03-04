import mongoose, { Schema } from 'mongoose';

export interface ReferenceDTO {
  _id: Schema.Types.UUID;
  external_reference_id: string;
  title: string;
  author: string;
  publication_year: number;
  publisher: string;
  price: number;
  soft_delete: boolean;
  created_at: Date;
  updated_at: Date;
}

export const referenceSchema = new Schema<ReferenceDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  external_reference_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publication_year: { type: Number, required: true },
  publisher: { type: String, required: true },
  price: { type: Number, required: true },
  soft_delete: { type: Boolean, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const referenceModel = mongoose.model<ReferenceDTO>('Reference', referenceSchema);

export type ReferenceModel = typeof referenceModel;
