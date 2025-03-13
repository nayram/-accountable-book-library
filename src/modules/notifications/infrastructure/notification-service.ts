import { EmailClient } from '@libs/email-client/domain/email-client';

import { NotificationService } from '../domain/notification-service';

export function notificationServiceBuilder({ emailClient }: { emailClient: EmailClient }): NotificationService {
  return {
    async send({ to, from, message, title }) {
      await emailClient.send({ to, from, payload: message, subject: title });
    },
  };
}
