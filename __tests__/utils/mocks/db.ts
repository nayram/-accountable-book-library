import { isConnected, connectMongoDb } from '@resources/mongodb';

const db = connectMongoDb();

export async function dbDropCollection(collectionName: string) {
  if (isConnected()) {
    await db.dropCollection(collectionName);
  }
}

export async function dropReferencesCollection() {
  await dbDropCollection('references');
}

export async function dropWalletCollection() {
  await dbDropCollection('wallets');
}

export async function dropBookCollection() {
  await dbDropCollection('books');
}

export async function dropUserCollection() {
  await dbDropCollection('users');
}

export async function dropReservationCollection() {
  await dbDropCollection('reservations');
}

export async function dropAllCollections() {
  await Promise.all([
    dropReferencesCollection(),
    dropBookCollection(),
    dropUserCollection(),
    dropWalletCollection(),
    dropReservationCollection(),
  ]);
}
