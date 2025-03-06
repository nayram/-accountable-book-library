import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';
import { externalReferenceIdFixtures } from '@tests/utils/fixtures/references/external-reference-id-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/references/publication-year-fixtures';
import { Pagination } from '@modules/shared/core/domain/pagination';
import { toDTO } from '@modules/shared/references/infrastructure/reference-dto';

import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';
import { SearchParams } from '../domain/search-params';
import { referenceModel } from '../../shared/references/infrastructure/reference-model';

import { referenceRepository } from '.';

describe('ReferenceRepository', () => {

  describe('exists', () => {
    it('should return true if reference exists', async () => {
      const reference = referenceFixtures.create();
      await referenceModel.create(toDTO(reference));
      const secondReference = referenceFixtures.create({ externalReferenceId: reference.externalReferenceId });
      await expect(referenceRepository.exits(secondReference.externalReferenceId)).resolves.toBe(true);
    });

    it('should return false if reference does not exist', async () => {
      const reference = referenceFixtures.create();
      await expect(referenceRepository.exits(reference.externalReferenceId)).resolves.toBe(false);
    });
  });

  describe('findByExteranlReferenceId', () => {
    it('should throw ReferenceDoesNotExistsError if reference does not exist', async () => {
      const externalReferenceId = externalReferenceIdFixtures.create();
      expect(referenceRepository.findByExteranlReferenceId(externalReferenceId)).rejects.toThrow(
        ReferenceDoesNotExistsError,
      );
    });

    it('should return reference if it exists', async () => {
      const reference = referenceFixtures.create();
      await referenceModel.create(toDTO(reference));
      expect(referenceRepository.findByExteranlReferenceId(reference.externalReferenceId)).resolves.toEqual(reference);
    });
  });

  describe('softDeleteById', () => {
    it('should throw ReferenceDoesNotExistsError if reference does not exist', () => {
      const id = referenceIdFixtures.create();
      expect(referenceRepository.softDeleteById(id)).rejects.toThrow(ReferenceDoesNotExistsError);
    });

    it('should soft delete reference successfully', async () => {
      const reference = referenceFixtures.create({ softDelete: false });
      await referenceModel.create(toDTO(reference));
      await referenceRepository.softDeleteById(reference.id);
      const res = await referenceModel.findById(reference.id);
      expect(res?.soft_delete).toBe(true);
    });
  });

  describe('find', () => {
    beforeEach(async () => {
      await referenceModel.deleteMany({});
    });

    describe('Basic pagination', () => {
      it('should return paginated references with next cursor', async () => {
        const totalCount = 4;
        const limit = 2;
        const references = await referenceFixtures.insertMany({ length: totalCount });
        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };

        const result = await referenceRepository.find(pagination, {});

        expect(result.data.length).toBe(limit);
        expect(result.totalCount).toBe(totalCount);
        expect(result.cursor).not.toBeNull();

        expect(result.data).toEqual(
          references.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(0, limit),
        );
      });

      it('should return less than limit when not enough items exist', async () => {
        const totalCount = 2;
        const limit = 5;
        await referenceFixtures.insertMany({ length: totalCount });
        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };

        const result = await referenceRepository.find(pagination, {});

        expect(result.data.length).toBe(totalCount);
        expect(result.totalCount).toBe(totalCount);
        expect(result.cursor).toBeNull();
      });
    });

    describe('Search parameters', () => {
      it('should return references matching title search parameter', async () => {
        const count = 4;
        const title = titleFixtures.create();
        const limit = 2;

        await referenceFixtures.insertMany({ reference: { title }, length: count });
        await referenceFixtures.insertMany({ length: count });

        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { title };
        const { data, totalCount, cursor } = await referenceRepository.find(pagination, searchParams);

        expect(data.length).toBe(limit);
        expect(totalCount).toBe(count);
        expect(cursor).not.toBeNull();

        for (const reference of data) {
          expect(reference.title).toEqual(title);
        }
      });

      it('should return references matching publication year search parameter', async () => {
        const publicationYear = publicationYearFixtures.create();
        const otherPublicationYear = publicationYear + 1;

        await referenceFixtures.insertMany({ reference: { publicationYear }, length: 3 });
        await referenceFixtures.insertMany({ reference: { publicationYear: otherPublicationYear }, length: 2 });

        const pagination: Pagination = {
          limit: 10,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { publicationYear };

        const result = await referenceRepository.find(pagination, searchParams);
        expect(result.data.length).toBe(3);
        expect(result.totalCount).toBe(3);

        for (const reference of result.data) {
          expect(reference.publicationYear).toEqual(publicationYear);
        }
      });

      it('should return references matching author search parameter', async () => {
        const author = authorFixtures.create();

        await referenceFixtures.insertMany({ reference: { author }, length: 3 });
        await referenceFixtures.insertMany({ length: 2 });

        const pagination: Pagination = {
          limit: 10,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { author };

        const result = await referenceRepository.find(pagination, searchParams);

        expect(result.data.length).toBe(3);
        expect(result.totalCount).toBe(3);

        for (const reference of result.data) {
          expect(reference.author).toEqual(author);
        }
      });

      it('should return references matching multiple search parameters', async () => {
        const author = authorFixtures.create();
        const publicationYear = publicationYearFixtures.create();

        await referenceFixtures.insertMany({
          reference: { author, publicationYear },
          length: 2,
        });
        await referenceFixtures.insertMany({
          reference: { author, publicationYear: publicationYear + 1 },
          length: 2,
        });
        await referenceFixtures.insertMany({
          reference: { author: 'Different Author', publicationYear },
          length: 2,
        });

        const pagination: Pagination = {
          limit: 10,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const searchParams: SearchParams = { author, publicationYear };

        const result = await referenceRepository.find(pagination, searchParams);

        expect(result.data.length).toBe(2);
        expect(result.totalCount).toBe(2);

        for (const reference of result.data) {
          expect(reference.author).toEqual(author);
          expect(reference.publicationYear).toEqual(publicationYear);
        }
      });
    });

    describe('Cursor pagination', () => {
      it('should fetch next batch of data using the cursor', async () => {
        const totalItems = 5;
        const limit = 2;
        const references = await referenceFixtures.insertMany({ length: totalItems });

        const pagination: Pagination = {
          limit,
          cursor: null,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };

        const firstBatch = await referenceRepository.find(pagination, {});

        expect(firstBatch.data.length).toBe(limit);
        expect(firstBatch.totalCount).toBe(totalItems);
        expect(firstBatch.cursor).not.toBeNull();

        expect(firstBatch.data).toEqual(
          references.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(0, limit),
        );

        const secondPagination: Pagination = {
          limit,
          cursor: firstBatch.cursor,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const secondBatch = await referenceRepository.find(secondPagination, {});

        expect(secondBatch.data.length).toBe(limit);
        expect(secondBatch.totalCount).toBe(totalItems);
        expect(secondBatch.cursor).not.toBeNull();

        expect(secondBatch.data).toEqual(
          references.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(limit, totalItems - 1),
        );

        const thirdPagination: Pagination = {
          limit,
          cursor: secondBatch.cursor,
          sortBy: 'createdAt',
          sortOrder: 'asc',
        };
        const thirdBatch = await referenceRepository.find(thirdPagination, {});

        expect(thirdBatch.data.length).toBe(1);
        expect(thirdBatch.totalCount).toBe(totalItems);
        expect(thirdBatch.cursor).toBeNull();

        expect(thirdBatch.data).toEqual(
          references.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).slice(-1),
        );
      });
    });
  });
});
