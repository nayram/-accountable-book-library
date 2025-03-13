import { isConnected } from '@libs/mongodb-utils';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { referenceModel } from '@modules/shared/references/infrastructure/reference-model';
import { connectMongoDb } from '@resources/mongodb';
import { bookFixtures } from '@tests/utils/fixtures/books/book-fixtures';

const db = connectMongoDb();

async function main(): Promise<void> {
  const startTime = Date.now();

  try {
    if (!isConnected()) {
      await db.connect();
      await db.dropCollection('books');
    }

    if (isConnected()) {
      console.info('Importing books...');

      const importStartTime = Date.now();

      const cursor = referenceModel.find().cursor();
      let importedCount = 0;

      for await (const reference of cursor) {
        console.log(`Import books for reference with id ${reference.id}`);
        try {
          await bookFixtures.insertMany({
            book: { referenceId: reference.id, status: BookStatus.Available },
            length: 4,
          });
          importedCount += 4;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(`Error: importing reference ${reference.id}`, error.message);
        }
      }

      const importDuration = (Date.now() - importStartTime) / 1000;
      console.info(`Successfully imported ${importedCount} books in ${importDuration.toFixed(2)} seconds`);
      console.info(`Average: ${(importedCount / importDuration).toFixed(2)} books per second`);
    }
  } catch (error) {
    console.error('Error importing books:', error);
  } finally {
    const totalDuration = (Date.now() - startTime) / 1000;
    console.info(`Total operation completed in ${totalDuration.toFixed(2)} seconds`);

    if (isConnected()) await db.disconnect();
    console.log('MongoDB connection closed');
  }
}

main().catch(console.error);
