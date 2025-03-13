import { Reminder } from '@modules/shared/reminders/domain/reminder/reminder';
import { RedisConsumer } from '@resources/redis';

export interface QueueService {
  create(topic: string): QueueService;
  enqueue(topic: string, payload: Reminder): Promise<void>;
  consume(topic: string, handler: (params: unknown) => Promise<void>): RedisConsumer;
}

export const QUEUE_EMAIL_SERVICE_TOPIC = 'belgium.book.library.core.email.service';
