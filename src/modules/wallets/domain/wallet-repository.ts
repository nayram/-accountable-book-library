import { Wallet } from './wallet/wallet';

export interface WalletRepository {
  save(wallet: Wallet): Promise<void>;
}
