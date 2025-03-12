import { pubSubClient } from '@libs/pub-sub';

import { calculateLateFeesSubscriberBuilder } from './calculate-late-fees';

export const calculateLateFeesSubscriber = calculateLateFeesSubscriberBuilder({ pubSubClient });
