import config from '../config';
import {
  Client,
} from '@elastic/elasticsearch';
import { logger } from './logUtil';

// class MyConnectionPool extends ConnectionPool {
//   markAlive(connection) {
//     super.markAlive(connection);
//   }
// }
// class MyConnection extends Connection {
//   request(params, callback) {
//     super.request(params, callback);
//   }
// }

const client = new Client({
  node: config.elasticSearchUrl,
  maxRetries: 3,
  requestTimeout: 30000,
});

export const search = async (params) => {
  const { body: { took, ...body } } = await client.search(params);
  logger.warn({ took });
  return body;
};

export const { create, update, bulk } = client;
