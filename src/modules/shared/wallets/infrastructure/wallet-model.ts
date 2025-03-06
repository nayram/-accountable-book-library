import mongoose, { Schema } from 'mongoose';

import { userModel } from '@modules/shared/users/infrastructure/users-model';

export interface WalletDTO {
  _id: Schema.Types.UUID;
  user_id: Schema.Types.UUID;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export const walletSchema = new Schema<WalletDTO>({
  _id: { type: Schema.Types.UUID, required: true },
  user_id: { type: Schema.Types.UUID, required: true, unique: true, ref: userModel },
  balance: { type: Number, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

walletSchema.index({ _id: 1, user_id: 1 });

export const walletModel = mongoose.model<WalletDTO>('Wallet', walletSchema);

export type WalletModel = typeof walletModel;
