import { faker } from '@faker-js/faker/locale/en'
import { Publisher } from '@modules/catalogs/domain/book/publisher'

export const publisherFixtures = {
  create(): Publisher {
    return faker.book.publisher()
  },
  invalid(): Publisher {
    const invalidValues = ['', ' ', 232]
    return faker.helpers.arrayElement(invalidValues) as unknown as Publisher
  },
}
