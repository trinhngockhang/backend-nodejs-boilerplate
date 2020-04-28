import redis from 'redis';
import bluebird from 'bluebird';
import config from '../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(config.redisUrl);

client.on('error', err => {
  // eslint-disable-next-line prefer-template
  console.log('Error ' + err);
  client.quit();
});
export default client;
