import { Router } from 'express';
import { body } from 'express-validator';

import { validateFields, protectedResource } from '../middlewares';
import { getUser, login, register } from '../controllers';

export const router = Router();

router.post(
  '/login',
  [
    body('email', 'Field Email is not valid')
      .trim()
      .isEmail()
      .notEmpty()
      .escape(),
    body('password', 'Field Password is not valid')
      .trim()
      .isString()
      .isLength({ min: 6 })
      .escape(),
    validateFields
    // protectedResource
  ],
  login
);

router.post(
  '/register',
  [
    body('email', 'Field Email is not valid')
      .trim()
      .isEmail()
      .notEmpty()
      .escape(),
    body('password', 'Field Password is not valid')
      .trim()
      .isString()
      .isLength({ min: 6 })
      .escape(),
    body('fullName', 'Field Full Name is not valid')
      .trim()
      .isString()
      .notEmpty()
      .escape(),
    body('profilePicUrl', 'Field Password is not valid')
      .trim()
      .optional()
      .isString()
      .isLength({ min: 6 })
      .escape(),
    validateFields
  ],
  register
);

router.get('/user/:userId', protectedResource, getUser);
