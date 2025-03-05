import { BookRepository } from '../domain/book-repository';

import { fromDTO } from './book-dto';
import { BookModel } from './book-model';

export function bookRepositoryBuilder({ model }: { model: BookModel }): BookRepository {
  return {
    async find(searchParams) {
      const books = await model.find({ reference_id: searchParams.referenceId });
      return books.map(fromDTO);
    },
  };
}
