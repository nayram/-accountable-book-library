import mongoose from 'mongoose';

import { ReservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { BookModel } from '@modules/shared/books/infrastructure/book-model';
import { WalletModel } from '@modules/shared/wallets/infrastructure/wallet-model';
import { toDTO as toReservationDTO } from '@modules/reservations/infrastructure/reservation-dto';
import { RepositoryError } from '@modules/shared/core/domain/repository-error';

import { ReservationTransactionsRepository } from '../domain/reservation-transactions-repository';

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

export function reservationTransactionsRepositoryBuilder({
  bookModel,
  walletModel,
  reservationModel,
}: {
  bookModel: BookModel;
  walletModel: WalletModel;
  reservationModel: ReservationModel;
}): ReservationTransactionsRepository {
  return {
    async save({ reservation, book, wallet }) {
      const session = await mongoose.startSession();
      try {
        await runTransactionWithRetry(session, async () => {
          const existingReservation = await reservationModel.findById(reservation.id);

          if (existingReservation) {
            await reservationModel.updateOne(
              { _id: reservation.id },
              {
                $set: {
                  borrowed_at: reservation.borrowedAt,
                  status: reservation.status,
                  late_fee: reservation.lateFee,
                  returned_at: reservation.returnedAt ? new Date(reservation.returnedAt) : null,
                  due_at: reservation.dueAt ? new Date(reservation.dueAt) : null,
                },
              },
              { session },
            );
          } else {
            await reservationModel.create([toReservationDTO(reservation)], { session });
          }

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

          if (wallet) {
            await walletModel.updateOne(
              { _id: wallet.id },
              {
                $set: {
                  balance: wallet.balance,
                  updated_at: wallet.updatedAt,
                },
              },
              {
                session,
              },
            );
          }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new RepositoryError(error.message);
      } finally {
        await session.endSession();
      }
    },
  };
}
