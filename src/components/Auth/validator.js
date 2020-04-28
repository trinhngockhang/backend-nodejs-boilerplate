import { body } from 'express-validator/check';
import { checkValidateError } from '../../middleware';

export const loginValidator = [
  body('username').exists({ checkFalsy: true }),
  // body('password').custom(value => Boolean(value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{6,20}$/g))),
  checkValidateError,
];
