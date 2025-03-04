import { Reference } from '@modules/references/domain/reference/reference';

interface ReferenceDTO {
  id: string;
  referenceId: string;
  title: string;
  author: string;
  publisher: string;
  publicationYear: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export function toDTO(reference: Reference): ReferenceDTO {
  return {
    id: reference.id,
    referenceId: reference.externalReferenceId,
    title: reference.title,
    author: reference.author,
    publisher: reference.publisher,
    publicationYear: reference.publicationYear,
    price: reference.price,
    createdAt: reference.createdAt,
    updatedAt: reference.updatedAt,
  };
}
