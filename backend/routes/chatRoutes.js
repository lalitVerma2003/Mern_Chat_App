import express from 'express';
import { checkAuth } from '../middleware/authMiddleware.js';
const router=express.Router();
import { accessChats,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup } from '../controller/chats.js';

router.post('/',checkAuth,accessChats);
router.get('/',checkAuth,fetchChats);
router.post('/group',checkAuth,createGroupChat);
router.put('/rename',checkAuth,renameGroup);
router.put('/groupadd',checkAuth,addToGroup);
router.put('/groupremove',checkAuth,removeFromGroup);

export default router;