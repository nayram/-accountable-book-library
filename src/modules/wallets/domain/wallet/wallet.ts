import { Entity } from '@modules/shared/core/domain/entity';
import { createUserId, UserId } from '@modules/shared/users/domain/user-id';
import { createPositiveInt, PositiveInt } from '@modules/shared/core/domain/value-objects/positive-int';

import { Balance, createBalance } from '../../../shared/wallets/domain/wallet/balance';

import { createWalletId, WalletId } from './wallet-id';

export type Wallet = Entity<{
  id: WalletId;
  userId: UserId;
  balance: Balance;
  createdAt: Date;
  updatedAt: Date;
}>;

interface WalletPrimitives {
  id: string;
  userId: string;
  balance: number;
}

export function createWallet({ id, userId, balance }: WalletPrimitives) {
  const now = new Date();
  return {
    id: createWalletId(id),
    userId: createUserId(userId),
    balance: createBalance(balance),
    createdAt: now,
    updatedAt: now,
  };
}

export function debit({ wallet, amount }: { wallet: Wallet; amount: PositiveInt }): Wallet {
  return {
    ...wallet,
    balance: wallet.balance + createPositiveInt(amount, 'amount'),
    updatedAt: new Date(),
  };
}

export function credit({ wallet, amount }: { wallet: Wallet; amount: PositiveInt }): Wallet {
  return {
    ...wallet,
    balance: wallet.balance - createPositiveInt(amount, 'amount'),
    updatedAt: new Date(),
  };
}
