import { EmailReminder } from './email-reminder';

export interface EmailService {
  send(notification: EmailReminder): Promise<void>;
}
