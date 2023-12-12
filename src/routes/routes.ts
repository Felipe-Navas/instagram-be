import { Router } from 'express';
import { body } from 'express-validator';

import { validateFields, protectedResource } from '../middlewares';
import { login, register } from '../controllers';

const router = Router();

router.post('/login', login);
router.post('/register', register);
// router.post(
//  '/createNode',
//  [
//    body('name', 'Field Name is not valid')
//      .trim()
//      .isString()
//      .notEmpty()
//      .escape(),
//    body('parentId', 'Field Parent ID is not valid')
//      .isInt()
//      .notEmpty()
//      .escape(),
//    validateFields
//  ],
//  createNodeController
// );

export default router;
