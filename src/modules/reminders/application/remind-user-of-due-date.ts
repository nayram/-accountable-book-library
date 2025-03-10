import { UseCase } from '@modules/shared/core/application/use-case';

import { EmailService } from '../domain/email-service';
import { createDueDateReminder } from '../domain/reminder/reminder';

export interface RemindUserOfDueDatesRequest {
  email: string;
  name: string;
  referenceTitle: string;
}

export type RemindUserOfDueDatesUseCase = UseCase<RemindUserOfDueDatesRequest, void>;

export function remindUserOfDueDatesBuilder({
  emailService,
}: {
  emailService: EmailService;
}): RemindUserOfDueDatesUseCase {
  return async function createBook(request: RemindUserOfDueDatesRequest) {
    const reminder = createDueDateReminder(request);

    await emailService.send(reminder);
  };
}
