import { WalletRepository } from '../domain/wallet-repository';

import { WalletModel } from '../../shared/wallets/infrastructure/wallet-model';

export function walletRepositoryBuilder({ model }: { model: WalletModel }): WalletRepository {
  return {
    async save(wallet) {
      const existingWallet = await model.findOne({ _id: wallet.id, user_id: wallet.userId });
      if (existingWallet) {
        await model.updateOne(
          { _id: wallet.id, user_id: wallet.userId },
          {
            $set: {
              balance: wallet.balance,
              updated_at: wallet.updatedAt,
            },
          },
        );
      } else {
        await model.create({
          _id: wallet.id,
          user_id: wallet.userId,
          balance: wallet.balance,
          created_at: wallet.createdAt,
          updated_at: wallet.updatedAt,
        });
      }
    },
  };
}
