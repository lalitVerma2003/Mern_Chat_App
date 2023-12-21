import express from 'express';
const router=express.Router();
import { sendMessage,allMessages, deleteMessages } from '../controller/messages.js';
import { checkAuth } from '../middleware/authMiddleware.js';

router.post('/',checkAuth,sendMessage);
router.get('/:chatId',checkAuth,allMessages);
router.delete('/delete',checkAuth,deleteMessages);

export default router;