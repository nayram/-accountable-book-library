import { createEmail } from '@modules/shared/core/domain/value-objects/email';

export type UserEmail = string;

export function createUserEmail(email: string) {
  return createEmail(email, 'user email');
}
