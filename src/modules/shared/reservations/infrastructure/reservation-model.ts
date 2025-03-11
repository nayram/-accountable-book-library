import mongoose, { Schema } from 'mongoose';

import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { userModel } from '@modules/shared/users/infrastructure/users-model';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';

export interface ReservationDTO {
  _id: Schema.Types.UUID;
  user_id: Schema.Types.UUID;
  reference_id: Schema.Types.UUID;
  book_id: Schema.Types.UUID;
  late_fee: number;
  reservation_fee: number;
  status: ReservationStatus;
  due_at: Schema.Types.Date | null;
  returned_at: Schema.Types.Date | null;
  borrowed_at: Schema.Types.Date | null;
  reserved_at: Schema.Types.Date;
}

export const reservationSchema = new Schema<ReservationDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  user_id: { type: Schema.Types.UUID, required: true, ref: userModel },
  reference_id: { type: Schema.Types.UUID, required: true, ref: referenceModel },
  book_id: { type: Schema.Types.UUID, required: true, ref: bookModel },
  status: { type: String, required: true, enum: ReservationStatus },
  late_fee: { type: Number, required: true },
  reservation_fee: { type: Number, required: true },
  reserved_at: { type: Schema.Types.Date, required: true },
  borrowed_at: { type: Schema.Types.Date, required: false },
  due_at: { type: Schema.Types.Date, required: false },
  returned_at: { type: Schema.Types.Date, required: false },
});

export const reservationModel = mongoose.model<ReservationDTO>('Reservation', reservationSchema);

export type ReservationModel = typeof reservationModel;
