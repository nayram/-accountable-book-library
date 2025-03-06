import { createReservation } from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });
