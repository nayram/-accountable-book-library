import { WalletId } from '@modules/wallets/domain/wallet/wallet-id';

import { uuidFixtures } from '../shared/uuid-fixtures';

export const walletIdFixtures = {
  create(): WalletId {
    return uuidFixtures.create();
  },
  invalid() {
    return uuidFixtures.invalid();
  },
};
