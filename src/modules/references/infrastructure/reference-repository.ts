import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';
import { ReferenceRepository } from '../domain/reference-repository';
import { fromDTO } from '../../shared/references/infrastructure/reference-dto';
import { ReferenceModel } from '../../shared/references/infrastructure/reference-model';

import { hasTextIndex, mapSortByFieldToReferenceModelField } from './helper-functions';
import { ReferenceModelError } from './reference-model-error';

export function referenceRepositoryBuilder({
  referenceModel,
}: {
  referenceModel: ReferenceModel;
}): ReferenceRepository {
  return {
    async exits(exterenalReferenceId) {
      const result = await referenceModel.findOne({ external_reference_id: exterenalReferenceId });
      return result != null;
    },
    async findByExteranlReferenceId(externalReferenceId) {
      const result = await referenceModel.findOne({ external_reference_id: externalReferenceId });
      if (!result) {
        throw new ReferenceDoesNotExistsError(externalReferenceId);
      }
      return fromDTO(result);
    },
    async softDeleteById(id) {
      const reference = await referenceModel.findById(id);
      if (!reference) {
        throw new ReferenceDoesNotExistsError(id);
      }

      await referenceModel.updateOne(
        { _id: id },
        {
          $set: {
            soft_delete: true,
            updated_at: new Date(),
          },
        },
      );
    },
    async find(pagination, searchParams) {
      const limit = Math.min(pagination.limit || 20, 100);

      const sortBy = mapSortByFieldToReferenceModelField(pagination.sortBy);

      const filter: Record<string, unknown> = { soft_delete: false };

      if (searchParams.publicationYear) {
        filter.publication_year = searchParams.publicationYear;
      }

      if (searchParams.title) {
        if (await hasTextIndex()) {
          filter.$text = { $search: searchParams.title };
        } else {
          filter.title = { $regex: searchParams.title, $options: 'i' };
        }
      }

      if (searchParams.author) {
        filter.author = { $regex: searchParams.author, $options: 'i' };
      }

      const sort: Record<string, 1 | -1> = {
        [sortBy]: pagination.sortOrder === 'desc' ? -1 : 1,
      };

      if (pagination.cursor) {
        try {
          const lastDoc = await referenceModel.findById(pagination.cursor).lean();
          if (!lastDoc) {
            throw new ReferenceModelError('Invalid cursor');
          }

          const operator = pagination.sortOrder === 'asc' ? '$gt' : '$lt';
          filter[sortBy] = { [operator]: (lastDoc as Record<string, unknown>)[sortBy] };
        } catch (error) {
          console.error('Error applying cursor:', error);
          throw new ReferenceModelError('Invalid pagination cursor');
        }
      }

      const references = await referenceModel
        .find(filter)
        .sort(sort)
        .limit(limit + 1)
        .lean();

      const hasMore = references.length > limit;

      const items = hasMore ? references.slice(0, limit) : references;

      const nextCursor = hasMore && items.length > 0 ? String(items[items.length - 1]._id) : null;

      delete filter[sortBy];
      const count = await referenceModel.countDocuments(filter);

      return { totalCount: count, cursor: nextCursor, data: items.map(fromDTO) };
    },
  };
}
