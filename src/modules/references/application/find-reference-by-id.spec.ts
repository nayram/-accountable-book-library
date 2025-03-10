import { faker } from '@faker-js/faker/locale/en';
import { mock } from 'jest-mock-extended';
import { when } from 'jest-when';

import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { referenceIdFixtures } from '@tests/utils/fixtures/references/reference-id-fixtures';

import { ReferenceRepository } from '../domain/reference-repository';
import { ReferenceDoesNotExistsError } from '../domain/reference-does-not-exists-error';

import { FindReferenceByIdUseCase, findReferenceByIdBuilder } from './find-reference-by-id';

describe('find reference by id', () => {
  let findReferenceById: FindReferenceByIdUseCase;

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
    when(referenceRepository.findById)
      .mockImplementation((id) => {
        throw new ReferenceDoesNotExistsError(id);
      })
      .calledWith(reference.id)
      .mockResolvedValue(reference);

    findReferenceById = findReferenceByIdBuilder({ referenceRepository });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should throw FieldValidationError when provided id is invalid', () => {
    expect(findReferenceById({ id: referenceIdFixtures.invalid() })).rejects.toThrow(FieldValidationError);
  });

  it('should throw ReferenceDoesNotExistsError when the provided id has no corresponding reference', () => {
    expect(findReferenceById({ id: referenceIdFixtures.create() })).rejects.toThrow(ReferenceDoesNotExistsError);
  });

  it('should return reference', () => {
    expect(findReferenceById({ id: reference.id })).resolves.toEqual(reference);
  });
});
