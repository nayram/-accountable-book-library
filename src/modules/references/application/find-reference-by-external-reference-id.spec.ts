import { faker } from '@faker-js/faker/locale/en';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { externalReferenceIdFixtures } from '@tests/utils/fixtures/references/external-reference-id-fixtures';

import { ReferenceRepository } from '../domain/reference-repository';
import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';

import {
  FindReferenceByExternalReferenceIdUseCase,
  findReferenceByExternalReferenceIdBuilder,
} from './find-reference-by-external-reference-id';

describe('find reference by id', () => {
  let findReferenceByExternalReferenceId: FindReferenceByExternalReferenceIdUseCase;

  const systemDateTime = faker.date.recent();

  const reference = referenceFixtures.create({
    createdAt: systemDateTime,
    updatedAt: systemDateTime,
  });

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(systemDateTime);
  });

  beforeEach(() => {
    const referenceRepository = mock<ReferenceRepository>();
    when(referenceRepository.findByExteranlReferenceId)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith(reference.externalReferenceId)
      .mockResolvedValue(reference);

    findReferenceByExternalReferenceId = findReferenceByExternalReferenceIdBuilder({ referenceRepository });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should throw FieldValidationError when provided id is invalid', () => {
    expect(
      findReferenceByExternalReferenceId({ externalReferenceId: externalReferenceIdFixtures.invalid() }),
    ).rejects.toThrow(FieldValidationError);
  });

  it('should throw ReferenceDoesNotExistsError when the provided reference id has no corresponding reference', () => {
    expect(
      findReferenceByExternalReferenceId({ externalReferenceId: externalReferenceIdFixtures.create() }),
    ).rejects.toThrow(ReferenceDoesNotExistsError);
  });

  it('should return reference', () => {
    expect(findReferenceByExternalReferenceId({ externalReferenceId: reference.externalReferenceId })).resolves.toEqual(
      reference,
    );
  });
});
