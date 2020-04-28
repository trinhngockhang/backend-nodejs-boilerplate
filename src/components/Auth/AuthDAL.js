import * as dbUtil from '../../util/databaseUtil';
import uuidv4 from 'uuid/v4';
import { ERRORS, REDIS, TOKEN } from '../../constant';
import redisUtil from '../../util/redisUtil';
import * as common from './common';

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

export const getRefreshToken = async (token) => {
  const refreshToken = uuidv4();
  redisUtil.setAsync(`${REDIS.REFRESH_TOKEN_PREFIX}:${refreshToken}`, token, 'ex', TOKEN.REFRESH_TOKEN_EXPIRED).catch(() => { });
  return refreshToken;
};

export const refreshToken = async (oldRefreshToken) => {
  const oldToken = await redisUtil.getAsync(`${REDIS.REFRESH_TOKEN_PREFIX}:${oldRefreshToken}`);
  const { id } = await common.getUserInfoFromToken(oldToken);
  const newToken = await common.generateToken(id);
  const newRefreshToken = uuidv4();
  await Promise.all([
    redisUtil.delAsync(`${REDIS.REFRESH_TOKEN_PREFIX}:${oldRefreshToken}`),
    redisUtil.setAsync(`${REDIS.REFRESH_TOKEN_PREFIX}:${newRefreshToken}`, newToken, 'ex', TOKEN.REFRESH_TOKEN_EXPIRED),
  ]);
  return { token: newToken, refreshToken: newRefreshToken };
};
