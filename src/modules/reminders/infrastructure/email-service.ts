import { EmailClient } from '@libs/email-client/domain/email-client';

import { EmailService } from '../domain/email-service';

export function emailServiceBuilder({ emailClient }: { emailClient: EmailClient }): EmailService {
  return {
    async send({ to, from, payload }) {
      await emailClient.send({ to, from, payload: payload.message, subject: payload.subject });
    },
  };
}
