import config from 'config';

import { getDBConnector, isConnected } from '@libs/mongodb-utils';

type connection = {
  url: string;
  name: string;
};

const dbConnection = config.get<connection>('db');

const connectMongoDb = () => getDBConnector(`${dbConnection.url}/${dbConnection.name}`);

export { connectMongoDb, isConnected };
