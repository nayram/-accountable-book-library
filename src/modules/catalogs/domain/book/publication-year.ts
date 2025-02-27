import { createPositiveInt } from "@modules/shared/core/domain/value-objects/positive-int";

export type PublicationYear = number;

export function createPublicationYear(year: number): PublicationYear {
  return createPositiveInt(year, 'publication year');
}
