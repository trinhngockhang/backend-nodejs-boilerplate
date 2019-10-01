import * as dbUtil from '../../util/databaseUtil';

export const getUserByUsername = async (username) => {
  const sql = 'SELECT id,username,passwordHash FROM admin WHERE username = ? LIMIT 1';
  return dbUtil.queryOne(sql, [username]);
};
