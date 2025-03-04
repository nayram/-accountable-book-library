import { faker } from '@faker-js/faker/locale/en';

import { Reference } from '@modules/references/domain/reference/reference';
import { referenceModel } from '@modules/references/infrastructure/repository-model';
import { toDTO } from '@modules/references/infrastructure/reference-dto';

import { titleFixtures } from './title-fixtures';
import { authorFixtures } from './author-fixtures';
import { publicationYearFixtures } from './publication-year-fixtures';
import { publisherFixtures } from './publisher-fixtures';
import { priceFixtures } from './price-fixtures';
import { externalReferenceIdFixtures } from './external-reference-id-fixtures';
import { referenceIdFixtures } from './reference-id-fixtures';

export const referenceFixtures = {
  create(reference?: Partial<Reference>) {
    return {
      ...createReference(),
      ...reference,
    };
  },
  createMany({ reference, length = 5 }: { reference?: Partial<Reference>; length?: number }): Reference[] {
    return Array.from({ length }, () => this.create(reference));
  },
  async insert(reference?: Partial<Reference>): Promise<Reference> {
    const createdReference = this.create(reference);
    await referenceModel.create(toDTO(createdReference));
    return createdReference;
  },
  async insertMany({
    reference,
    length = 5,
  }: {
    reference?: Partial<Reference>;
    length?: number;
  }): Promise<Reference[]> {
    const references = this.createMany({ reference, length });
    await referenceModel.create(references.map(toDTO));
    return references;
  },
};

function createReference(): Reference {
  const date = faker.date.recent();
  return {
    id: referenceIdFixtures.create(),
    externalReferenceId: externalReferenceIdFixtures.create(),
    title: titleFixtures.create(),
    author: authorFixtures.create(),
    publicationYear: publicationYearFixtures.create(),
    publisher: publisherFixtures.create(),
    softDelete: false,
    price: priceFixtures.create(),
    createdAt: date,
    updatedAt: date,
  };
}
