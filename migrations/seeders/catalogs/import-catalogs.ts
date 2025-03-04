// import * as fs from 'fs';
// import * as path from 'path';

// import { parse } from 'csv-parse';
// import { Schema } from 'mongoose';
// import { bookModel } from '@modules/references/infrastructure/book-model';
// import { uuidGenerator } from '@modules/shared/core/infrastructure';
// import { isConnected, connectMongoDb } from '@resources/mongodb';

// const db = connectMongoDb();

// interface Book {
//   _id: Schema.Types.UUID;
//   reference_id: string;
//   title: string;
//   author: string;
//   publication_year: number;
//   publisher: string;
//   price: number;
//   quantity: number;
//   created_at: Date;
//   updated_at: Date;
// }

// function validateCsvFile(filePath: string): boolean {
//   try {
//     fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK);

//     const stats = fs.statSync(filePath);
//     if (!stats.isFile()) {
//       console.error(`Error: ${filePath} is not a file`);
//       return false;
//     }

//     if (!filePath.toLowerCase().endsWith('.csv')) {
//       console.warn(`Warning: ${filePath} does not have a .csv extension`);
//     }

//     return true;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error(`Error validating CSV file: ${filePath}`);
//     console.error(error.message);
//     return false;
//   }
// }

// async function processCSV(filePath: string, batchSize: number = 100): Promise<void> {
//   if (!validateCsvFile(filePath)) {
//     throw new Error(`Cannot process CSV file at ${filePath}. File does not exist or is not accessible.`);
//   }

//   let totalRecords = 0;
//   let successfulRecords = 0;
//   let errorRecords = 0;

//   let batch: Book[] = [];

//   const parser = parse({
//     delimiter: ',',
//     columns: true,
//     skip_empty_lines: true,
//     trim: true,
//     cast: true,
//   });

//   const stream = fs.createReadStream(filePath).pipe(parser);

//   for await (const record of stream) {
//     try {
//       totalRecords++;

//       if (!record.id || !record.title) {
//         console.warn(`Record at index ${totalRecords} is missing required fields, skipping.`);
//         errorRecords++;
//         continue;
//       }

//       const bookData: Book = {
//         _id: uuidGenerator.generate() as unknown as Schema.Types.UUID,
//         reference_id: String(record.id),
//         title: String(record.title),
//         author: String(record.author),
//         publication_year: parseInt(record.publication_year),
//         publisher: String(record.publisher),
//         price: parseInt(record.price),
//         quantity: 4,
//         created_at: new Date(),
//         updated_at: new Date(),
//       };

//       batch.push(bookData);

//       if (batch.length >= batchSize) {
//         await saveBatch(batch);
//         successfulRecords += batch.length;
//         batch = [];

//         console.log(`Processed ${totalRecords} records. Success: ${successfulRecords}, Errors: ${errorRecords}`);
//       }
//     } catch (error) {
//       errorRecords++;
//       console.error(`Error processing record at index ${totalRecords}:`, error);
//     }
//   }

//   if (batch.length > 0) {
//     await saveBatch(batch);
//     successfulRecords += batch.length;
//   }

//   console.log(`
//     CSV Processing Complete:
//     Total records: ${totalRecords}
//     Successfully saved: ${successfulRecords}
//     Errors: ${errorRecords}
//   `);
// }

// async function saveBatch(batch: Book[]): Promise<void> {
//   try {
//     const operations = batch.map((book) => ({
//       updateOne: {
//         filter: { reference_id: book.reference_id },
//         update: { $set: book },
//         upsert: true,
//       },
//     }));

//     await bookModel.bulkWrite(operations);
//   } catch (error) {
//     console.error('Error saving batch to MongoDB:', error);
//     throw error;
//   }
// }

// async function main(): Promise<void> {
//   try {
//     if (!isConnected()) {
//       await db.connect();
//       await db.dropCollection('books');
//     }
//     const csvFilePath = path.resolve(__dirname, 'books_sample_technical_challenge.csv');

//     if (isConnected()) {
//       await processCSV(csvFilePath, 200);
//       console.log('CSV processing completed successfully');
//     }
//   } catch (error) {
//     console.error('Error in CSV processing:', error);
//   } finally {
//     if (isConnected()) await db.disconnect();
//     console.log('MongoDB connection closed');
//   }
// }

// main().catch(console.error);
