import { dbSetUp, dbTearDown, dropReferencesCollection } from '@tests/utils/mocks/db';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';

import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';

import { referenceModel } from './repository-model';

import { referenceRepository } from '.';

describe('ReferenceRepository', () => {
  beforeAll(async () => {
    await dbSetUp();
  });

  beforeEach(async () => {
    await dropReferencesCollection();
  });

  afterAll(async () => {
    await dbTearDown();
  });

  describe('save', () => {
    it('should create a reference', async () => {
      const reference = referenceFixtures.create();
      await referenceRepository.save(reference);
      const result = await referenceModel.findById(reference.id);
      expect(result).not.toBeNull();
      expect(result?._id).toBe(reference.id);
      expect(result?.external_reference_id).toBe(reference.externalReferenceId);
      expect(result?.title).toBe(reference.title);
      expect(result?.author).toBe(reference.author);
      expect(result?.publication_year).toBe(reference.publicationYear);
      expect(result?.price).toBe(reference.price);
      expect(result?.soft_delete).toEqual(reference.softDelete);
      expect(result?.created_at).toBe(reference.createdAt.toISOString());
      expect(result?.updated_at).toBe(reference.updatedAt.toISOString());
    });
  });

  describe('exists', () => {
    it('should return true if reference exists', async () => {
      const reference = referenceFixtures.create();
      await referenceRepository.save(reference);
      const secondReference = referenceFixtures.create({ externalReferenceId: reference.externalReferenceId });
      await expect(referenceRepository.exits(secondReference.author)).resolves.toBe(true);
    });

    it('should return false if reference does not exist', async () => {
      const reference = referenceFixtures.create();
      await expect(referenceRepository.exits(reference.externalReferenceId)).resolves.toBe(false);
    });
  });

  describe('findById', () => {
    it('should throw ReferenceDoesNotExistsError if reference does not exist', async () => {
      const id = referenceIdFixtures.create();
      expect(referenceRepository.findById(id)).rejects.toThrow(ReferenceDoesNotExistsError);
    });

    it('should return reference if it exists', async () => {
      const reference = referenceFixtures.create();
      await referenceRepository.save(reference);
      expect(referenceRepository.findById(reference.id)).resolves.toEqual(reference);
    });
  });

  describe('softDeleteById', () => {
    it('should throw ReferenceDoesNotExistsError if reference does not exist', () => {
      const id = referenceIdFixtures.create();
      expect(referenceRepository.softDeleteById(id)).rejects.toThrow(ReferenceDoesNotExistsError);
    });

    it('should soft delete reference successfully', async () => {
      const reference = referenceFixtures.create({ softDelete: false });
      await referenceRepository.save(reference);
      await referenceRepository.softDeleteById(reference.id);
      const res = await referenceRepository.findById(reference.id);

      expect(res.softDelete).toBe(true);
    });
  });

  describe('find', () => {
    it('should return paginated references with next cursor', async () => {
      const totalCount = 4;
      const limit = 2;
      const cursor = null;
      await referenceFixtures.insertMany({ length: totalCount });

      const pagination = { limit, cursor };
      const searchParams = {};

      const result = await referenceRepository.find(pagination, searchParams);

      expect(result.data.length).toBe(limit);
      expect(result.totalCount).toBe(totalCount);
      expect(result.cursor).not.toBeNull();
    });

    it('should return references matching search parameters', async () => {
      const count = 4;
      const title = titleFixtures.create();
      const limit = 2;

      await referenceFixtures.insertMany({ reference: { title }, length: count });
      await referenceFixtures.insertMany({ length: count });

      const pagination = { limit, cursor: null };
      const searchParams = { title };

      const { data, totalCount, cursor } = await referenceRepository.find(pagination, searchParams);

      expect(data.length).toBe(limit);
      expect(totalCount).toBe(count);
      expect(cursor).not.toBeNull();
      for (const reference of data) {
        expect(reference.title).toEqual(title);
      }
    });

    it('should fetch next batch of data using the cursor', async () => {
      const author = authorFixtures.create();
      const count = 4;
      const limit = 1;
      await referenceFixtures.insertMany({ reference: { author }, length: count });
      await referenceFixtures.insertMany({});

      const pagination = { limit, cursor: null };
      const searchParams = { author };

      const firstBatch = await referenceRepository.find(pagination, searchParams);

      expect(firstBatch.data.length).toBe(limit);
      expect(firstBatch.totalCount).toBe(count);
      expect(firstBatch.cursor).not.toBeNull();

      const nextPagination = { limit, cursor: firstBatch.cursor };
      const secondBatch = await referenceRepository.find(nextPagination, searchParams);

      expect(secondBatch.data.length).toBe(limit);
      expect(secondBatch.totalCount).toBe(4);
    });
  });
});
