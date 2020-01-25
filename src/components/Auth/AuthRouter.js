import { Router } from 'express';
import * as controller from './AuthController';
import { loginValidator } from './validator';
import { throwAsNext } from '../../middleware';

const path = '/auth';
const router = Router();

// route
// --- Get Me ---
router.get('/getme', throwAsNext(controller.getme));
// --- Login ---
router.post('/login', loginValidator, throwAsNext(controller.login));
// --- Sign up ---
router.post('/signUp', throwAsNext(controller.signUp));
// registerSubrouter

// export
export default { path, router };
