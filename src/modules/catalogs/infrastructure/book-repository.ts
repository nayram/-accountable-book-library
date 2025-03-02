import { BookDoesNotExistsError } from '../domain/book-does-not-exist-error';
import { BookRepository } from '../domain/book-repository';

import { fromDTO } from './book-dto';
import { BookModel } from './book-model';

export function bookRepositoryBuilder({ model }: { model: BookModel }): BookRepository {
  return {
    async save(book) {
      const existingBook = await model.findById(book.id);
      if (existingBook) {
        await model.updateOne(
          { _id: book.id },
          {
            $set: {
              title: book.title,
              reference_id: book.referenceId,
              author: book.author,
              publication_year: book.publicationYear,
              quantity: book.quantity,
              price: book.price,
              publisher: book.publisher,
              updated_at: book.updatedAt,
            },
          },
        );
      } else {
        await model.create({
          _id: book.id,
          reference_id: book.referenceId,
          quantity: book.quantity,
          price: book.price,
          author: book.author,
          title: book.title,
          publication_year: book.publicationYear,
          publisher: book.publisher,
          created_at: book.createdAt,
          updated_at: book.updatedAt,
        });
      }
    },
    async exits({ title, author, publisher }) {
      const result = await model.findOne({ title, author, publisher });
      return result != null;
    },
    async findById(id) {
      const result = await model.findById(id);
      if (!result) {
        throw new BookDoesNotExistsError(id);
      }
      return fromDTO(result);
    },
    async deleteById(id) {
      const result = await model.findById(id);
      if (!result) {
        throw new BookDoesNotExistsError(id);
      }
      await model.findByIdAndDelete(id);
    },
  };
}
