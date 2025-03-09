import mongoose from 'mongoose';

import { ReservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { BookModel } from '@modules/shared/books/infrastructure/book-model';
import { toDTO as toReservationDTO } from '@modules/reservations/infrastructure/reservation-dto';
import { RepositoryError } from '@modules/shared/core/domain/repository-error';

import { CreateReservationRepository } from '../domain/create-reservation-repository';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 100;

async function runTransactionWithRetry(
  session: mongoose.ClientSession,
  txnFunc: () => Promise<void>,
  maxRetries: number = MAX_RETRIES,
): Promise<void> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      session.startTransaction();
      await txnFunc();
      await session.commitTransaction();
      return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Transaction error on attempt', attempt + 1, error.message);
      // Check if the error is transient
      if (error.errorLabels && error.errorLabels.includes('TransientTransactionError')) {
        attempt++;
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
        console.log(
          `TransientTransactionError encountered. Retrying transaction (attempt ${attempt}/${maxRetries})...`,
        );

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
        throw error;
      }
    }
  }
  throw new Error('Transaction failed after maximum retry attempts.');
}

export function createReservationRepositoryBuilder({
  bookModel,
  reservationModel,
}: {
  bookModel: BookModel;
  reservationModel: ReservationModel;
}): CreateReservationRepository {
  return {
    async save({ reservation, book }) {
      const session = await mongoose.startSession();
      try {
        await runTransactionWithRetry(session, async () => {
          await reservationModel.create([toReservationDTO(reservation)], { session });

          await bookModel.updateOne(
            { _id: book.id },
            {
              $set: {
                status: book.status,
                updated_at: book.updatedAt,
              },
            },
            {
              session,
            },
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Transaction failed:', error);
        throw new RepositoryError(error.message);
      } finally {
        await session.endSession();
      }
    },
  };
}
