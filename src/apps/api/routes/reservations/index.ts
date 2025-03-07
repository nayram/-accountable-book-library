import { createReservation, findReservations } from '@modules/reservations/applications';

import { postCreateReservationControllerBuilder } from './post-create-reservation-controller';
import { getReservationsControllerBuilder } from './get-reservations-controller';

export const postCreateReservationController = postCreateReservationControllerBuilder({ createReservation });

export const getReservationsController = getReservationsControllerBuilder({ findReservations });
