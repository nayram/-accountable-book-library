import { UseCase } from '@modules/shared/core/application/use-case'
import { BookRepository } from '../domain/book-repository'
import { create as createBook } from '../domain/book/book'
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator'

export interface CreateCatalogRequest {
  title: string
  author: string
  publicationYear: number
  publisher: string
  price: number
  quantity: number
}

export type CreateCatalogUseCase = UseCase<CreateCatalogRequest, void>

export function createCatalogBuilder({
  bookRepository,
  uuidGenerator,
}: {
  bookRepository: BookRepository
  uuidGenerator: UuidGenerator
}): CreateCatalogUseCase {
  return async function createCatalogUseCase(request: CreateCatalogRequest) {
    const book = createBook({
      ...request,
      id: uuidGenerator.generate(),
    })
    await bookRepository.save(book)
  }
}
