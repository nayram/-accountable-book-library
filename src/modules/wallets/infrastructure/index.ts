import { walletModel } from '../../shared/wallets/infrastructure/wallet-model';

import { walletRepositoryBuilder } from './wallet-repository';

export const walletRepository = walletRepositoryBuilder({ model: walletModel });
