import { bookFixtures } from '@tests/utils/fixtures/catalog/book-fixtures'
import { dbSetUp, dbTearDown } from '@tests/utils/mocks/db'
import { bookRepository } from '.'
import { bookModel } from './book-model'

describe('BookRepository', () => {
  beforeAll(async () => {
    await dbSetUp()
  })

  afterAll(async () => {
    await dbTearDown()
  })

  describe('save', () => {
    it('should create a book', async () => {
      const book = bookFixtures.create()
      await bookRepository.save(book)
      const result = await bookModel.findById(book.id)
      expect(result).not.toBeNull()
      expect(result?._id).toBe(book.id)
      expect(result?.title).toBe(book.title)
      expect(result?.author).toBe(book.author)
      expect(result?.publication_year).toBe(book.publicationYear)
      expect(result?.quantity).toBe(book.quantity)
      expect(result?.price).toBe(book.price)
      expect(result?.created_at.toISOString()).toBe(book.createdAt.toISOString())
      expect(result?.updated_at.toISOString()).toBe(book.updatedAt.toISOString())
    })

    it('should update a book', async () => {
        const book = bookFixtures.create()
        await bookRepository.save(book)
        const updatedBook = bookFixtures.create({ id: book.id })
        await bookRepository.save(updatedBook)
        
        const result = await bookModel
          .findById(updatedBook.id)

        expect(result).not.toBeNull()
        expect(result?._id).toBe(updatedBook.id)
        expect(result?.title).toBe(updatedBook.title)
        expect(result?.author).toBe(updatedBook.author)
        expect(result?.publication_year).toBe(updatedBook.publicationYear)
        expect(result?.quantity).toBe(updatedBook.quantity)
        expect(result?.price).toBe(updatedBook.price)
        expect(result?.created_at.toISOString()).toBe(book.createdAt.toISOString())
        expect(result?.updated_at.toISOString()).toBe(updatedBook.updatedAt.toISOString())
    })
  })
})
