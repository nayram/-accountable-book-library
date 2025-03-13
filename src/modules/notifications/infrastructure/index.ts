import { emailClient } from '@libs/email-client/infrastructure';

import { notificationServiceBuilder } from './notification-service';

export const notificationService = notificationServiceBuilder({ emailClient });
