import { Notification } from './notification';

export interface NotificationService {
  send(notification: Notification): Promise<void>;
}
