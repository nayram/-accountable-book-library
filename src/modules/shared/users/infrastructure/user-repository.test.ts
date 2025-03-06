import { userIdFixtures } from '@tests/utils/fixtures/users/user-id-fixtures';
import { userFixtures } from '@tests/utils/fixtures/users/user-fixtures';

import { UserDoesNotExistsError } from '../domain/user-does-not-exists-error';

import { userRepository } from '.';

describe('User Repository', () => {
  describe('exists', () => {
    it('should throw UserDoesNotExistsError', async () => {
      await expect(userRepository.exists(userIdFixtures.create())).rejects.toThrow(UserDoesNotExistsError);
    });

    it('should resolve successfully', async () => {
      const user = await userFixtures.insert();
      await expect(userRepository.exists(user.id)).resolves.toBeUndefined();
    });
  });
});
