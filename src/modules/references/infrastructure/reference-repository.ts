import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';
import { ReferenceRepository } from '../domain/reference-repository';

import { fromDTO } from './reference-dto';
import { ReferenceModel } from './repository-model';

export function referenceRepositoryBuilder({
  referenceModel,
}: {
  referenceModel: ReferenceModel;
}): ReferenceRepository {
  return {
    async save(reference) {
      await referenceModel.create({
        _id: reference.id,
        external_reference_id: reference.externalReferenceId,
        price: reference.price,
        author: reference.author,
        title: reference.title,
        publication_year: reference.publicationYear,
        publisher: reference.publisher,
        created_at: reference.createdAt,
        updated_at: reference.updatedAt,
      });
    },
    async exits(exterenalReferenceId) {
      const result = await referenceModel.findOne({ external_reference_id: exterenalReferenceId });
      return result != null;
    },
    async findById(id) {
      const result = await referenceModel.findById(id);
      if (!result) {
        throw new ReferenceDoesNotExistsError(id);
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
      const filter: Record<string, unknown> = {};

      if (searchParams.publicationYear) {
        filter.publication_year = searchParams.publicationYear;
      }

      if (searchParams.title) {
        filter.title = { $regex: searchParams.title, $options: 'i' };
      }

      if (searchParams.author) {
        filter.author = { $regex: searchParams.author, $options: 'i' };
      }

      const queryBuilder = referenceModel.find(filter).lean(true);
      if (pagination.cursor) {
        queryBuilder.where({ _id: { $gt: pagination.cursor } });
      }
      const references = await queryBuilder.limit(pagination.limit);

      const nextCursor = references.length > 0 ? String(references[references.length - 1]._id) : null;

      const count = await referenceModel.where(filter).countDocuments();

      return { totalCount: count, cursor: nextCursor, data: references.map(fromDTO) };
    },
  };
}
