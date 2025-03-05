import { walletModel } from './wallet-model';
import { walletRepositoryBuilder } from './wallet-repository';

export const walletRepository = walletRepositoryBuilder({ model: walletModel });
