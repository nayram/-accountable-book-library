import { emailService } from '../infrastructure';

import { remindUserOfDueDatesBuilder } from './remind-user-of-due-date';
import { remindUserOfLateReturnsBuilder } from './remind-user-of-late-returns';

export const remindUserOfDueDates = remindUserOfDueDatesBuilder({ emailService });
export const remindUserOfLateReturns = remindUserOfLateReturnsBuilder({ emailService });
