import { createEmail, Email } from '@modules/shared/core/domain/value-objects/email';
import { createString } from '@modules/shared/core/domain/value-objects/string';

export type Notification = Readonly<{
  from: Email;
  to: Email;
  message: string;
  title: string;
}>;

export function createNotification({
  from,
  to,
  message,
  title,
}: {
  from: string;
  to: string;
  message: string;
  title: string;
}): Notification {
  return {
    from: createEmail(from, 'from'),
    to: createEmail(to, 'to'),
    message: createString(message, 'message'),
    title: createString(title, 'title'),
  };
}
