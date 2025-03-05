import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db';
import { walletFixtures } from '@tests/utils/fixtures/wallet/wallet-fixtures';

import { walletModel } from '../../shared/wallets/infrastructure/wallet-model';

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

  describe('save', () => {
    it('should create a new wallet when it does not exist', async () => {
      const wallet = walletFixtures.create();

      await walletRepository.save(wallet);

      const savedWallet = await walletModel.findOne({ _id: wallet.id });

      expect(savedWallet).not.toBeNull();
      expect(savedWallet?._id.toString()).toBe(wallet.id);
      expect(savedWallet?.user_id.toString()).toBe(wallet.userId);
      expect(savedWallet?.balance).toBe(wallet.balance);
      expect(savedWallet?.created_at).toEqual(wallet.createdAt);
      expect(savedWallet?.updated_at).toEqual(wallet.updatedAt);
    });

    it('should update an existing wallet when it exists', async () => {
      const initialWallet = walletFixtures.create();

      await walletModel.create({
        _id: initialWallet.id,
        user_id: initialWallet.userId,
        balance: initialWallet.balance,
        created_at: initialWallet.createdAt,
        updated_at: initialWallet.updatedAt,
      });

      const updatedWallet = {
        ...initialWallet,
        balance: initialWallet.balance + 1000,
        updatedAt: new Date(),
      };

      await walletRepository.save(updatedWallet);

      const savedWallet = await walletModel.findOne({ _id: initialWallet.id });

      expect(savedWallet).not.toBeNull();
      expect(savedWallet?.balance).toBe(updatedWallet.balance);
      expect(savedWallet?.updated_at).toEqual(updatedWallet.updatedAt);
      expect(savedWallet?.created_at).toEqual(initialWallet.createdAt);
    });

    it('should handle saving a wallet with negative balance', async () => {
      const wallet = walletFixtures.create({ balance: -500 });
      await walletRepository.save(wallet);

      const savedWallet = await walletModel.findOne({ _id: wallet.id });

      expect(savedWallet).not.toBeNull();
      expect(savedWallet?.balance).toBe(-500);
    });
  });
});
