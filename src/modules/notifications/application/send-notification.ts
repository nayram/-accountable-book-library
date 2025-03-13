import { UseCase } from '@modules/shared/core/application/use-case';

import { NotificationService } from '../domain/notification-service';

export interface SendNotificationRequest {
  from: string;
  to: string;
  message: string;
  title: string;
}

export type SendNotificationUseCase = UseCase<SendNotificationRequest, void>;

export function sendNotificationBuilder({
  notificationService,
}: {
  notificationService: NotificationService;
}): SendNotificationUseCase {
  return async function sendNotification(request: SendNotificationRequest) {
    await notificationService.send(request);
  };
}
