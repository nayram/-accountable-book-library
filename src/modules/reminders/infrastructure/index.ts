import { emailClient } from '@libs/email-client/infrastructure';

import { emailServiceBuilder } from './email-service';

export const emailService = emailServiceBuilder({ emailClient });
