import { Barcode } from '@modules/shared/books/domain/book/bar-code';

export class BookAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReferenceAlreadyExistsError';
  }
  static withBarCode(barcode: Barcode) {
    return new BookAlreadyExistsError(`book with barcode ${barcode} already exists`);
  }
}
