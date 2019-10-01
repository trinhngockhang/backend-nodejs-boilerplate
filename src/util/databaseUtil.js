import mysql from 'mysql';
import _ from 'lodash';
import config from '../config';

const pool = mysql.createPool(config.databaseUrl);

/**
 * Get Connecttion
 */
export const getConnection = async () => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return reject(err);
    }
    return resolve(connection);
  });
});

/**
 * Begin Transaction
 */
export const beginTransaction = async () => {
  const connection = await getConnection();
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return reject(err);
      }
      return resolve(connection);
    });
  });
};

/**
 * Rollback Transaction
 */
export const rollbackTransaction = async transaction => new Promise((resolve, reject) => {
  transaction.rollback((err) => {
    transaction.release();
    if (err) {
      return reject(err);
    }
    return resolve();
  });
});

/**
 * Commit Transaction
 */
export const commitTransaction = async transaction => new Promise((resolve, reject) => {
  transaction.commit(async (errCommit) => {
    if (errCommit) {
      try {
        await rollbackTransaction(transaction);
      } catch (errorRollback) {
        return reject(Object.assign(errCommit, { errorRollback }));
      }
      return reject(errCommit);
    }
    transaction.release();
    return resolve();
  });
});

/**
 *
 * @param {string} sql
 * @param {array} params
 */
export const query = async (sql, params) => {
  console.log('----------------------------');
  console.log('sql', mysql.format(sql, params));
  console.log('----------------------------');

  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
};

/**
 *
 * @param {string} sql
 * @param {array} params
 */
export const queryOne = async (sql, params) => {
  const results = await query(sql, params);
  return results[0];
};

/**
 *
 * @param {string} sql
 * @param {array} params
 */
export const execute = async (sql, params, transaction) => {
  console.log('----------------------------');
  console.log('sql', mysql.format(sql, params));
  console.log('----------------------------');

  return new Promise((resolve, reject) => {
    if (!transaction) {
      pool.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    } else {
      transaction.query(sql, params, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }
  });
};

export const nested = (obj) => {
  if (!obj) {
    return null;
  }
  const keys = Object.keys(obj);
  return keys.reduce((result, path) => _.set(result, path, obj[path]), {});
};

export const group = (array, primaryKey, key) => {
  const result = [];
  const primaryKeys = [];
  for (const item of array) {
    const item1 = item[key];
    const indexOf = primaryKeys.indexOf(item[primaryKey]);
    if (indexOf !== -1) {
      result[indexOf][key].push(item1);
    } else {
      const newItem = {};
      newItem[key] = [item1];
      primaryKeys.push(item[primaryKey]);
      result.push(Object.assign(item, newItem));
    }
  }
  return result;
};

export const queryAndCount = async (sql, params, keyCount = 'count') => {
  const results = await query(sql, params);
  if (results.length === 0) {
    return [[], 0];
  }
  const count = results[0][keyCount];
  const items = results.map(element => {
    Reflect.deleteProperty(element, keyCount);
    return element;
  });
  return [items, count];
};
