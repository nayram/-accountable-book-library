import { Entity } from '@modules/shared/core/domain/entity';

import { ReferenceId, createReferenceId } from './reference-id';
import { createTitle, Title } from './title';
import { createPublicationYear, PublicationYear } from './publication-year';
import { Author, createAuthor } from './author';
import { createPublisher, Publisher } from './publisher';
import { createPrice, Price } from './price';
import { createExternalReferenceId, ExternalReferenceId } from './external-reference-id';

export type Reference = Entity<{
  id: ReferenceId;
  externalReferenceId: ExternalReferenceId;
  title: Title;
  publicationYear: PublicationYear;
  author: Author;
  publisher: Publisher;
  price: Price;
  softDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}>;

export interface ReferencePrimitives {
  id: string;
  externalReferenceId: string;
  title: string;
  publicationYear: number;
  author: string;
  publisher: string;
  price: number;
}

export function create({
  id,
  externalReferenceId,
  title,
  publicationYear,
  author,
  publisher,
  price,
}: ReferencePrimitives): Reference {
  const now = new Date();
  return {
    id: createReferenceId(id),
    externalReferenceId: createExternalReferenceId(externalReferenceId),
    title: createTitle(title),
    publicationYear: createPublicationYear(publicationYear),
    price: createPrice(price),
    author: createAuthor(author),
    publisher: createPublisher(publisher),
    softDelete: false,
    createdAt: now,
    updatedAt: now,
  };
}
