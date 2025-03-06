import mongoose, { Schema } from 'mongoose';
import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { userModel } from '@modules/shared/users/infrastructure/users-model';

export interface ReservationDTO {
  _id: Schema.Types.UUID;
  user_id: Schema.Types.UUID;
  reference_id: Schema.Types.UUID;
  book_id: Schema.Types.UUID;
  reserved_at: Date;
}

export const reservationSchema = new Schema<ReservationDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  user_id: { type: Schema.Types.UUID, required: true, ref: userModel },
  reference_id: { type: Schema.Types.UUID, required: true, ref: referenceModel },
  book_id: { type: Schema.Types.UUID, required: true, ref: bookModel },
  reserved_at: { type: Date, required: true },
});

export const reservationModel = mongoose.model<ReservationDTO>('Reservation', reservationSchema);

export type ReservationModel = typeof reservationModel;
