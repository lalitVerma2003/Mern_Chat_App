import  express  from "express";
const router=express.Router();
import { addNotification,deleteNotification,notifications } from "../controller/notification.js";
import { checkAuth } from "../middleware/authMiddleware.js";

router.get("/",notifications);
router.post("/add",checkAuth,addNotification);
router.delete("/delete",checkAuth,deleteNotification);

export default router;