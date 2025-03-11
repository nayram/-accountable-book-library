import { calculateLateFees } from '@modules/reservations/applications';

import { calculateLateFeesSubscriberBuilder } from './calculate-late-fees';

export const calculateLateFeesSubscriber = calculateLateFeesSubscriberBuilder({ calculateLateFees });
