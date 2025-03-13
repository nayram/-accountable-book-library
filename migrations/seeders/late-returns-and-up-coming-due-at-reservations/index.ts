import { faker } from '@faker-js/faker/locale/en';
import { ReservationStatus } from '@modules/reservations/domain/reservation/reservation-status';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { bookModel } from '@modules/shared/books/infrastructure/book-model';
import { convertISOToDateString } from '@modules/shared/core/domain/value-objects/iso-date';
import { uuidGenerator } from '@modules/shared/core/infrastructure';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { ReservationDTO, reservationModel } from '@modules/shared/reservations/infrastructure/reservation-model';
import { isConnected, connectMongoDb } from '@resources/mongodb';
import { Schema } from 'mongoose';

const latReturnsUserID = ['fd7dae8e-7d41-495f-a445-2b741c97252b', '66ec0221-b6ae-4ede-a39f-a2917dfa78d0'];
const upComingUserIds = ['e95d4bd8-76cc-4a3e-b5e3-4030a8c5f252', '0f2baa7a-bdb5-48e7-ad1e-77a6d1fe9d67'];
const referenceIds = ['446677450', '3150000335', '435272683', '1558744150', '1592571301', '671867113'];

const db = connectMongoDb();

async function main(): Promise<void> {
  try {
    if (!isConnected()) {
      await db.connect();
      await db.dropCollection('reservations');
    }

    if (isConnected()) {
      console.info('generating data');
      const reservations: ReservationDTO[] = [];
      const references = [];
      const allBooks = [];
      const now = Date();
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + 2);
      dueDate.setHours(0, 0, 0, 0);

      for (const referenceId of referenceIds) {
        const reference = await referenceModel.findOne({ external_reference_id: referenceId });
        references.push(reference?._id);
        const [book] = await bookModel.find({ reference_id: reference?._id });
        if (book) {
          await bookModel.updateOne({ _id: book._id }, { $set: { status: BookStatus.Borrowed } });
          allBooks.push(book);
        }
      }

      for (const userId of latReturnsUserID) {
        for (const book of allBooks) {
          const reservation: ReservationDTO = {
            _id: uuidGenerator.generate() as unknown as Schema.Types.UUID,
            reference_id: book.reference_id,
            user_id: userId as unknown as Schema.Types.UUID,
            book_id: book._id,
            late_fee: 0,
            reservation_fee: 3,
            status: ReservationStatus.Borrowed,
            due_at: faker.date.past({ years: 3 }),
            returned_at: null,
            borrowed_at: new Date(),
            reserved_at: new Date(),
          };
          reservations.push(reservation);
        }
      }

      for (const userId of upComingUserIds) {
        for (const book of allBooks) {
          const reservation: ReservationDTO = {
            _id: uuidGenerator.generate() as unknown as Schema.Types.UUID,
            reference_id: book.reference_id,
            user_id: userId as unknown as Schema.Types.UUID,
            book_id: book._id,
            late_fee: 0,
            reservation_fee: 3,
            status: ReservationStatus.Borrowed,
            due_at: dueDate,
            returned_at: null,
            borrowed_at: new Date(),
            reserved_at: new Date(),
          };
          reservations.push(reservation);
        }
      }

      await reservationModel.create(reservations);
      console.info('done');
    }
  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    if (isConnected()) await db.disconnect();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
