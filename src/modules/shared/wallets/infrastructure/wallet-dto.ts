import { Wallet } from '@modules/wallets/domain/wallet/wallet';
import { Schema } from 'mongoose';

import { WalletDTO } from './wallet-model';

export function fromDTO(dto: WalletDTO): Wallet {
  return {
    id: String(dto._id),
    userId: String(dto.user_id),
    balance: dto.balance,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toDTO(wallet: Wallet): WalletDTO {
  return {
    _id: wallet.id as unknown as Schema.Types.UUID,
    user_id: wallet.userId as unknown as Schema.Types.UUID,
    balance: wallet.balance,
    created_at: wallet.createdAt,
    updated_at: wallet.updatedAt,
  };
}
