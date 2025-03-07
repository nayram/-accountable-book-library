import { BookModel } from '@modules/shared/books/infrastructure/book-model';

import { BookRepository } from '../domain/book-repository';
import { BookAlreadyExistsError } from '../domain/book-already-exists-error';

export function bookRepositoryBuilder({ model }: { model: BookModel }): BookRepository {
  return {
    async save(book) {
      const existingBook = await model.findOne({ _id: book.id, barcode: book.barcode });
      if (existingBook) {
        await model.updateOne(
          { _id: book.id, barcode: book.barcode },
          {
            $set: {
              barcode: book.barcode,
              reference_id: book.referenceId,
              status: book.status,
              updated_at: book.updatedAt,
            },
          },
        );
      } else {
        await model.create({
          _id: book.id,
          reference_id: book.referenceId,
          barcode: book.barcode,
          status: book.status,
          created_at: book.createdAt,
          updated_at: book.updatedAt,
        });
      }
    },

    async exists(barcode) {
      const book = await model.findOne({ barcode });
      if (book) {
        throw BookAlreadyExistsError.withBarCode(barcode);
      }
    },
  };
}
