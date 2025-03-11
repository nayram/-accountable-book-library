import { userModel } from '@modules/shared/users/infrastructure/users-model';
import { isConnected, connectMongoDb } from '@resources/mongodb';

import users from './users-collection';
import { walletModel } from '@modules/shared/wallets/infrastructure/wallet-model';
import { uuidGenerator } from '@modules/shared/core/infrastructure';

const db = connectMongoDb();

async function main(): Promise<void> {
  try {
    if (!isConnected()) {
      await db.connect();
      await db.dropCollection('users');
    }

    if (isConnected()) {
      console.info('importing users');
      for (const user of users) {
        await userModel.create(user);
        await walletModel.create({
          _id: uuidGenerator.generate(),
          user_id: user._id,
          balance: 100,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

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
