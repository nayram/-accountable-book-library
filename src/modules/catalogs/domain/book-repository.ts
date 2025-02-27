import { Book } from "./book/book";

export interface BookRepository {
    save(book: Book): Promise<void>;
}
