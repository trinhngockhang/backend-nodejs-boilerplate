import * as dbUtil from '../../util/databaseUtil';
import uuidv4 from 'uuid/v4';
import { ERRORS } from '../../constant';

export const getUserByUsername = async (username) => {
  const sql = 'SELECT id,username,password FROM users WHERE username = ? LIMIT 1';
  return dbUtil.queryOne(sql, [username]);
};
export const signUp = async ({ username, passwordHash, name }) => {
  const check = await checkUserExist(username);
  if (check) {
    return Promise.reject(ERRORS.USER_EXIST);
  }
  const sql = 'INSERT INTO users(id,username, password, name) VALUES (?, ?, ?, ?)';
  const id = uuidv4();
  await dbUtil.query(sql, [id, username, passwordHash, name]);
};

export const checkUserExist = async (username) => {
  const sql = 'SELECT username FROM users WHERE username = ?';
  const result = await dbUtil.query(sql, [username]);
  if (result.length > 0) {
    return true;
  }
  return false;
};

export const getUserById = async (userId) => {
  const sql = 'SELECT username, name, createdAt FROM users WHERE id = ?';
  const user = await dbUtil.queryOne(sql, [userId]);
  return user;
};
