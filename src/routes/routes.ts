import { Router } from 'express';
import { body } from 'express-validator';

import { validateFields } from '../middlewares/validate-fields';

const router = Router();

// router.get('/get', getController);
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
