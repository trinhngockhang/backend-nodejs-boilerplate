import * as common from './common';
import * as dbAccess from './AuthDAL';
import { ERRORS } from '../../constant';

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await dbAccess.getUserByUsername(username);
  if (user) {
    const passwordValid = await common.checkPassword(password, user.passwordHash);
    if (passwordValid) {
      const token = await common.generateToken(user.id);
      return res.json({ token });
    }
    return Promise.reject(ERRORS.INVALID_PASSWORD_ERROR);
  }
  return Promise.reject(ERRORS.USER_NOTFOUND_ERROR);
};
