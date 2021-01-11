/* eslint-disable no-unused-vars */
import * as common from './common';
import * as dbAccess from './AuthDAL';
import { ERRORS } from '../../constant';
import { hash } from '../../util/bcryptUtil';
import { buildSuccessResponse } from '../../util/responseUtil';

export const getMe = async (req, res) => {
  const { userId } = req;
  const user = await dbAccess.getUserById(userId);
  res.send(user);
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await dbAccess.getUserByUsername(username);
  if (user) {
    const passwordValid = await common.checkPassword(password, user.password);
    if (passwordValid) {
      const token = await common.generateToken(user.id);
      const refreshToken = await dbAccess.getRefreshToken(token);
      return res.json(buildSuccessResponse({ token, refreshToken }));
    }
    return Promise.reject(ERRORS.INVALID_PASSWORD_ERROR);
  }
  return Promise.reject(ERRORS.USER_NOTFOUND_ERROR);
};

export const signUp = async (req, res) => {
  const { username, password, name, rePassword } = req.body;
  if (password !== rePassword) {
    res.status(400).send("adsdasdas");
    return;
  }
  const passwordHash = hash(password);
  await dbAccess.signUp({ username, passwordHash, name });
  res.ok();
};

export const refreshToken = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;
  res.json(await dbAccess.refreshToken(oldRefreshToken));
};
