import { BookRepository } from '../domain/book-repository';

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
  };
}
