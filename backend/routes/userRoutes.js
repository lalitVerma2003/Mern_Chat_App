import express from 'express';
import { createUser,loginUser,allUsers } from '../controller/user.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router=express.Router();

router.get('/',checkAuth,allUsers);

router.post('/login',loginUser);

router.post('/register',createUser);

export default router;