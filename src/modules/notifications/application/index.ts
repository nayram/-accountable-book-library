import { notificationService } from '../infrastructure';

import { sendNotificationBuilder } from './send-notification';

export const sendNotification = sendNotificationBuilder({ notificationService });
