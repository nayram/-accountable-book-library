import { WalletDoesNotExistsError } from '../domain/wallet-does-not-exists-error';
import { WalletRepository } from '../domain/wallet-repository';

import { fromDTO } from './wallet-dto';
import { WalletModel } from './wallet-model';

export function walletRepositoryBuilder({ model }: { model: WalletModel }): WalletRepository {
  return {
    async findByUserId(userId) {
      const wallet = await model.findOne({ user_id: userId });
      if (!wallet) {
        throw WalletDoesNotExistsError.withUserId(userId);
      }

      return fromDTO(wallet);
    },
  };
}
