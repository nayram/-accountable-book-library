import { Model } from 'mongoose'

export interface PersistenceClient {
  create: <T extends Document>(model: Model<T>, data: Record<string, unknown>) => Promise<void>
}

export const persistence: PersistenceClient = {
  create: async (model, data) => {
    await model.create(data)
  },
}
