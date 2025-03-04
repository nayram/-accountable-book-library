import { mock, MockProxy } from 'jest-mock-extended';
import { when } from 'jest-when';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

import { ReferenceRepository } from '../domain/reference-repository';
import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';

import { deleteReferenceByIdBuilder, DeleteReferenceByIdUseCase } from './delete-reference-by-id';

describe('delete reference by id', () => {
  let deleteReferenceById: DeleteReferenceByIdUseCase;
  let referenceRepository: MockProxy<ReferenceRepository>;

  const reference = referenceFixtures.create();

  beforeEach(() => {
    referenceRepository = mock<ReferenceRepository>();
    when(referenceRepository.softDeleteById)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith(reference.id)
      .mockResolvedValue();

    deleteReferenceById = deleteReferenceByIdBuilder({ referenceRepository });
  });

  it('should throw FieldValidationError when provided id is invalid', () => {
    expect(deleteReferenceById({ id: referenceIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw ReferenceDoesNotExistsError when the provided reference id has no corresponding reference', () => {
    expect(deleteReferenceById({ id: referenceIdFixtures.create() })).rejects.toThrow(ReferenceDoesNotExistsError);
  });

  it('should soft delete reference', async () => {
    await deleteReferenceById({ id: reference.id });
    expect(referenceRepository.softDeleteById).toHaveBeenCalledWith(reference.id);
  });
});
