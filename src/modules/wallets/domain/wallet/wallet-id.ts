import { createUuid, Uuid } from '@modules/shared/core/domain/value-objects/uuid';

export type WalletId = Uuid;

export function createWalletId(value: string) {
  return createUuid(value, 'walletId');
}
