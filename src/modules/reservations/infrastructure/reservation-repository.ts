import { mapSortByFieldToModelField } from '@modules/shared/core/infrastructure/helper-functions';
import { RepositoryError } from '@modules/shared/core/domain/repository-error';

import { ReservationRepository } from '../domain/reservation-repository';

import { ReservationModel } from '../../shared/reservations/infrastructure/reservation-model';
import { fromDTO } from './reservation-dto';
import { ReservationDoesNotExistError } from '../../shared/reservations/domain/reservation-does-not-exist';

export function reservationRepositoryBuilder({ model }: { model: ReservationModel }): ReservationRepository {
  return {
    async find(pagination, searchParams) {
      const limit = Math.min(pagination.limit || 20, 100);

      const sortBy = mapSortByFieldToModelField(pagination.sortBy);

      const filter: Record<string, unknown> = {};

      if (searchParams.referenceId) {
        filter.reference_id = searchParams.referenceId;
      }

      if (searchParams.userId) {
        filter.user_id = searchParams.userId;
      }

      const sort: Record<string, 1 | -1> = {
        [sortBy]: pagination.sortOrder === 'desc' ? -1 : 1,
      };

      if (pagination.cursor) {
        try {
          const lastDoc = await model.findById(pagination.cursor).lean();
          if (!lastDoc) {
            throw new RepositoryError('Invalid cursor');
          }

          const operator = pagination.sortOrder === 'asc' ? '$gt' : '$lt';
          filter[sortBy] = { [operator]: (lastDoc as Record<string, unknown>)[sortBy] };
        } catch (error) {
          console.error('Error applying cursor:', error);
          throw new RepositoryError('Invalid pagination cursor');
        }
      }

      const reservations = await model
        .find(filter)
        .sort(sort)
        .limit(limit + 1)
        .lean();

      const hasMore = reservations.length > limit;

      const items = hasMore ? reservations.slice(0, limit) : reservations;

      const nextCursor = hasMore && items.length > 0 ? String(items[items.length - 1]._id) : null;

      delete filter[sortBy];
      const count = await model.countDocuments(filter);

      return { totalCount: count, cursor: nextCursor, data: items.map(fromDTO) };
    },

    async findById(id) {
      const reservation = await model.findById(id);
      if (!reservation) {
        throw new ReservationDoesNotExistError(id);
      }
      return fromDTO(reservation);
    },
  };
}
