import { sendNotification } from '@modules/notifications/application';
import { QUEUE_EMAIL_SERVICE_TOPIC } from '@modules/shared/core/domain/queue-service';
import { queueService } from '@modules/shared/core/infrastructure';
import { Reminder } from '@modules/shared/reminders/domain/reminder/reminder';

export async function subscribe() {
  return queueService
    .consume(QUEUE_EMAIL_SERVICE_TOPIC, async (params: unknown) => {
      const { id, data } = params as { id: string; data: Reminder };
      console.log(`Processing job ${id}:`, data);
      await sendNotification({
        title: data.payload.subject,
        message: data.payload.message,
        from: data.from,
        to: data.to,
      });
    })
    .on('ready', () => {
      console.log('consumer is ready');
    });
}
