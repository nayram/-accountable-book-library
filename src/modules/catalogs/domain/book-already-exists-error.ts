export class BookAlreadyExistsError extends Error {
  constructor({ title, author, publisher }: { title: string; author: string; publisher: string }) {
    super(`Book with title ${title}, author ${author} and publisher ${publisher} already exists`);
    this.name = 'BookAlreadyExistsError';
  }
}
