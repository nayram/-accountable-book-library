import mongoose from 'mongoose'

import { isConnected, connectMongoDb } from '@resources/mongodb'

const db = connectMongoDb()

export async function dbSetUp() {
  if (!isConnected()) {
    await db.connect()
  }
}

export async function dbTearDown() {
  if (isConnected()) {
    await db.dropDatabase()
    await db.disconnect()
  }
}

export async function dbDropCollection(collectionName: string) {
  if (isConnected()) {
    await db.dropCollection(collectionName)
  }
}
