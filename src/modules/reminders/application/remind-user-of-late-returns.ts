import { UseCase } from '@modules/shared/core/application/use-case';

import { EmailService } from '../domain/email-service';
import { createLateReturnReminder } from '../domain/reminder/reminder';

export interface RemindUserOfLateReturnsRequest {
  email: string;
  name: string;
  referenceTitle: string;
}

export type RemindUserOfLateReturnsUseCase = UseCase<RemindUserOfLateReturnsRequest, void>;

export function remindUserOfLateReturnsBuilder({
  emailService,
}: {
  emailService: EmailService;
}): RemindUserOfLateReturnsUseCase {
  return async function createBook(request: RemindUserOfLateReturnsRequest) {
    const reminder = createLateReturnReminder(request);

    await emailService.send(reminder);
  };
}
