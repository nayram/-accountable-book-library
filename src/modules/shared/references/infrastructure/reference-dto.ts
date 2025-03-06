import { Schema } from 'mongoose';

import { Reference } from '@modules/shared/references/domain/reference';

import { ReferenceDTO } from './reference-model';

export function fromDTO(dto: ReferenceDTO): Reference {
  return {
    id: String(dto._id),
    externalReferenceId: dto.external_reference_id,
    title: dto.title,
    author: dto.author,
    publisher: dto.publisher,
    publicationYear: dto.publication_year,
    price: dto.price,
    softDelete: dto.soft_delete,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function toDTO(reference: Reference): ReferenceDTO {
  return {
    _id: reference.id as unknown as Schema.Types.UUID,
    external_reference_id: reference.externalReferenceId,
    title: reference.title,
    author: reference.author,
    publisher: reference.publisher,
    publication_year: reference.publicationYear,
    price: reference.price,
    soft_delete: reference.softDelete,
    created_at: reference.createdAt,
    updated_at: reference.updatedAt,
  };
}
