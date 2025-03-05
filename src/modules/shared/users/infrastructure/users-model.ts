import mongoose, { Schema } from 'mongoose';

export interface UserDTO {
  _id: Schema.Types.UUID;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export const userSchema = new Schema<UserDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

export const userModel = mongoose.model<UserDTO>('User', userSchema);

export type UserModel = typeof userModel;
