import sendGrid from '@sendgrid/mail';

import { EmailClient } from '../domain/email-client';

export function sendGridClientBuilder({ apiKey, env }: { apiKey: string; env: 'test' | 'live' }): EmailClient {
  sendGrid.setApiKey(apiKey);

  return {
    async send(params) {
      if (env === 'test') {
        console.log('Email sent successfully');
        return;
      }
      await sendGrid.send({ to: params.to, from: params.from, subject: params.subject, text: params.payload });
    },
  };
}
