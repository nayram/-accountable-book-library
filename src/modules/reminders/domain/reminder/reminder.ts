import config from 'config';

import { Email } from '@modules/shared/core/domain/value-objects/email';

const noReplyEmailAddres = config.get<string>('noReplyEmailAddress');

export type Reminder = Readonly<{
  from: string;
  to: Email;
  payload: {
    message: string;
    subject: string;
  };
}>;

export function createDueDateReminder({
  email,
  name,
  referenceTitle,
}: {
  email: string;
  name: string;
  referenceTitle: string;
}): Reminder {
  return {
    from: noReplyEmailAddres,
    to: email,
    payload: {
      // eslint-disable-next-line max-len
      message: `Hi ${name}, Your borrowed book, ${referenceTitle} is due in 2 days. Please return it on time to avoid any late fees`,
      subject: 'Reminder',
    },
  };
}

export function createLateReturnReminder({
  email,
  name,
  referenceTitle,
}: {
  email: string;
  name: string;
  referenceTitle: string;
}): Reminder {
  return {
    from: noReplyEmailAddres,
    to: email,
    payload: {
      // eslint-disable-next-line max-len
      message: `Hi ${name}, Your borrowed book, ${referenceTitle} is 7 days overdue. Please return it immediately to prevent further late charges`,
      subject: 'Reminder',
    },
  };
}
