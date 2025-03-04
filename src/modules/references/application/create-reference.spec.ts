import { faker } from '@faker-js/faker/locale/en';
import { when } from 'jest-when';
import { mock, MockProxy } from 'jest-mock-extended';

import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';
import { referenceFixtures } from '@tests/utils/fixtures/references/reference-fixtures';
import { externalReferenceIdFixtures } from '@tests/utils/fixtures/references/external-reference-id-fixtures';

import { ReferenceRepository } from '../domain/reference-repository';
import { ReferenceAlreadyExistsError } from '../domain/reference-already-exists-error';

import { createReferenceBuilder, CreateReferenceUseCase } from './create-reference';
import { authorFixtures } from '@tests/utils/fixtures/references/author-fixtures';
import { priceFixtures } from '@tests/utils/fixtures/references/price-fixtures';
import { publicationYearFixtures } from '@tests/utils/fixtures/references/publication-year-fixtures';
import { publisherFixtures } from '@tests/utils/fixtures/references/publisher-fixtures';
import { titleFixtures } from '@tests/utils/fixtures/references/title-fixtures';

describe('create reference', () => {
  let createReference: CreateReferenceUseCase;
  let referenceRepository: MockProxy<ReferenceRepository>;

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
    referenceRepository = mock<ReferenceRepository>();
    const uuidGenerator = mock<UuidGenerator>();

    when(uuidGenerator.generate).mockReturnValue(reference.id);

    when(referenceRepository.exits)
      .calledWith(reference.externalReferenceId)
      .mockResolvedValueOnce(false)
      .mockReturnValue(true);

    createReference = createReferenceBuilder({
      referenceRepository,
      uuidGenerator,
    });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('should throw FieldValidationError when', () => {
    it('provided invalid external reference id', () => {
      expect(
        createReference({
          ...reference,
          externalReferenceId: externalReferenceIdFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid title value', () => {
      expect(
        createReference({
          ...reference,
          title: titleFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid author value', () => {
      expect(
        createReference({
          ...reference,
          author: authorFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid publication year value', () => {
      expect(
        createReference({
          ...reference,
          publicationYear: publicationYearFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid publisher value', () => {
      expect(
        createReference({
          ...reference,
          publisher: publisherFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });

    it('provided invalid price value', () => {
      expect(
        createReference({
          ...reference,
          price: priceFixtures.invalid(),
        }),
      ).rejects.toThrow(FieldValidationError);
    });
  });

  it('should throw ReferenceAlreadyExistsError when reference already exits', async () => {
    await createReference(reference);
    expect(createReference(reference)).rejects.toThrow(ReferenceAlreadyExistsError);
  });

  it('should save reference', async () => {
    await expect(createReference(reference)).resolves.toEqual(reference);
    expect(referenceRepository.save).toHaveBeenCalledWith(reference);
  });
});
