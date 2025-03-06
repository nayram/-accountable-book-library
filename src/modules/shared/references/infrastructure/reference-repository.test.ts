import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';

import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';

import { referenceRepository } from '.';

describe('referenceRepository', () => {
  describe('exists', () => {
    it('should throw ReferenceDoesNotExistsError if reference does not exist', () => {
      expect(referenceRepository.exists(referenceIdFixtures.create())).rejects.toThrow(ReferenceDoesNotExistsError);
    });

    it('should resolve successfully if user exists', async () => {
      const reference = await referenceFixtures.insert();
      await expect(referenceRepository.exists(reference.id)).resolves.toBeUndefined();
    });
  });
});
