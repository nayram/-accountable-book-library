import { UserId } from '@modules/shared/users/domain/user-id';
import { Wallet } from '@modules/wallets/domain/wallet/wallet';

export interface WalletRepository {
  findByUserId(userId: UserId): Promise<Wallet>;
}
