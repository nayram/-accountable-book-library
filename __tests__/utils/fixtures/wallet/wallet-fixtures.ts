import { faker } from '@faker-js/faker/locale/en';

import { Wallet } from '@modules/wallets/domain/wallet/wallet';

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
