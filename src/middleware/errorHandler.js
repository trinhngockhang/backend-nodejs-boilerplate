import { logger } from '../util/logUtil';

export const throwAsNext = f => async (req, res, next) => {
  try {
    await f(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
  if (typeof error === 'string') {
    res.status(500).json({ message: error });
    logger.error(error);
  } else {
    res.status(error.status || 500).json(error);
    logger.error({ ...error });
  }
};
