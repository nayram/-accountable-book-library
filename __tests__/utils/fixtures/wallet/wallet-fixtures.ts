import { faker } from '@faker-js/faker/locale/en';

import { Wallet } from '@modules/wallets/domain/wallet/wallet';
import { walletModel } from '@modules/shared/wallets/infrastructure/wallet-model';
import { toDTO } from '@modules/shared/wallets/infrastructure/wallet-dto';

import { userIdFixtures } from '../users/user-id-fixtures';

import { walletIdFixtures } from './wallet-id-fixtures';
import { balanceFixtures } from './balance-fixtures';

export const walletFixtures = {
  create(wallet?: Partial<Wallet>) {
    return {
      ...createWallet(),
      ...wallet,
    };
  },
  createMany({ wallet, length = 5 }: { wallet?: Partial<Wallet>; length?: number }): Wallet[] {
    return Array.from({ length }, () => this.create(wallet));
  },

  async insert(wallet?: Partial<Wallet>): Promise<Wallet> {
    const createdWallet = this.create(wallet);
    await walletModel.create(toDTO(createdWallet));
    return createdWallet;
  },

  async insertMany({ wallet, length = 5 }: { wallet?: Partial<Wallet>; length?: number }): Promise<Wallet[]> {
    const wallets = this.createMany({ wallet, length });
    await walletModel.create(wallets.map(toDTO));
    return wallets;
  },
};

function createWallet(): Wallet {
  const date = faker.date.recent();
  return {
    id: walletIdFixtures.create(),
    userId: userIdFixtures.create(),
    balance: balanceFixtures.create(),
    createdAt: date,
    updatedAt: date,
  };
}
