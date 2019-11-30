import { Router } from 'express';
import * as controller from './AuthController';
import { throwAsNext } from '../../middleware';

const path = '/auth';
const router = Router();

// route
// --- Login ---
router.post('/getme', throwAsNext(controller.getme));

// registerSubrouter

// export
export default { path, router };
