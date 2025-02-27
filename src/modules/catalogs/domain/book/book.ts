import { Entity } from '@modules/shared/core/domain/entity'
import { BookId, createBookId } from './book-id'
import { createTitle, Title } from './title'
import { createPublicationYear, PublicationYear } from './publication-year'
import { Author, createAuthor } from './author'
import { createPublisher, Publisher } from './publisher'
import { createQuantity, Quantity } from './quantity'
import { createPrice, Price } from './price'

export type Book = Entity<{
  id: BookId
  title: Title
  publicationYear: PublicationYear
  author: Author
  publisher: Publisher
  quantity: Quantity
  price: Price
  createdAt: Date
  updatedAt: Date
}>

export interface BookPrimitives {
  id: string
  title: string
  publicationYear: number
  author: string
  publisher: string
  price: number
  quantity: number
}

export function create({ id, title, publicationYear, author, publisher, price, quantity }: BookPrimitives): Book {
  const now = new Date()
  return {
    id: createBookId(id),
    title: createTitle(title),
    publicationYear: createPublicationYear(publicationYear),
    price: createPrice(price),
    author: createAuthor(author),
    publisher: createPublisher(publisher),
    quantity: createQuantity(quantity),
    createdAt: now,
    updatedAt: now,
  }
}
