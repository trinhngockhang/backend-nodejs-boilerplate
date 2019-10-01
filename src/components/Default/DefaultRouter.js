import { Router } from 'express';
import createError from 'http-errors';

const path = '';
const router = Router();

// route
router.get('/healthcheck', (req, res) => {
  res.send('ok');
});
router.use((req, res, next) => {
  next(createError.BadRequest('Request invalid!'));
});

// registerSubrouter


// export
export default { path, router };
