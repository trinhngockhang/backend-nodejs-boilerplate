import { validationResult } from 'express-validator/check';
import createError from 'http-errors';

export const checkValidateError = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(createError(422, 'Unprocessable Entity', { errors: errors.array() }));
  }
};
