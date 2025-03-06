import { isConnected, connectMongoDb } from '@resources/mongodb';

const db = connectMongoDb();

export async function dbSetUp() {
  if (!isConnected()) {
    await db.connect();
    await db.dropDatabase();
  }
}

export async function dbTearDown() {
  if (isConnected()) {
    await db.dropDatabase();
    await db.disconnect();
  }
}

export async function dbDropCollection(collectionName: string) {
  if (isConnected()) {
    await db.dropCollection(collectionName);
  }
}

export async function dropReferencesCollection() {
  if (isConnected()) {
    await dbDropCollection('references');
  }
}

export async function dropWalletCollection() {
  if (isConnected()) {
    await dbDropCollection('wallets');
  }
}

export async function dropBookCollection() {
  if (isConnected()) {
    await dbDropCollection('books');
  }
}

export async function dropUserCollection() {
  if (isConnected()) {
    await dbDropCollection('users');
  }
}

export async function dropAllCollections() {
  await Promise.all([dropReferencesCollection(), dropBookCollection(), dropUserCollection(), dropWalletCollection()]);
}
