import mongoose from 'mongoose';

import { TransactionalRepository } from '../domain/reference-book-transactional-repository';

export function transactionalRepositoryBuilder(): TransactionalRepository {
  return {
    async executeTransaction(operations) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        await operations(session);

        await session.commitTransaction();
        session.endSession();
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    },
  };
}
