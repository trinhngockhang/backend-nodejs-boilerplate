import { Router } from 'express';
import * as controller from './AuthController';
import { throwAsNext } from '../../middleware';
import {
  loginValidator,
} from './validator';

const path = '/auth';
const router = Router();

// route
// --- Login ---
router.post('/login', loginValidator, throwAsNext(controller.login));

// registerSubrouter

// export
export default { path, router };
