import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { WalletDoesNotExistsError } from '../domain/wallet-does-not-exists-error';

import { walletModel } from './wallet-model';
import { toDTO } from './wallet-dto';

import { walletRepository } from '.';

describe('WalletRepository', () => {
  beforeAll(async () => {
    await dbSetUp();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  beforeEach(async () => {
    await walletModel.deleteMany({});
  });

  describe('findByUserId', () => {
    it('should throw WalletDoesNotExistsError if user does not have a wallet', () => {
      expect(walletRepository.findByUserId(userIdFixtures.create())).rejects.toThrow(WalletDoesNotExistsError);
    });

    it('should find and return wallet', async () => {
      const userId = userIdFixtures.create();
      const wallet = walletFixtures.create({ userId });
      await walletModel.create(toDTO(wallet));
      const result = await walletRepository.findByUserId(userId);
      expect(result).not.toBeNull();
      expect(result.id).toEqual(wallet.id);
      expect(result.userId).toEqual(wallet.userId);
      expect(result.balance).toEqual(wallet.balance);
      expect(result.createdAt.toISOString()).toEqual(wallet.createdAt.toISOString());
      expect(result.updatedAt.toISOString()).toEqual(wallet.updatedAt.toISOString());
    });
  });
});
