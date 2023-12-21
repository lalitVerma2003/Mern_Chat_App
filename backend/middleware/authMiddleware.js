import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from "dotenv";
dotenv.config();

export async function checkAuth(req,res,next){
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        try{
            token=req.headers.authorization.slice(7);

            //decodes the token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.user_id).select("-password");
            // store user without password
            next();
        }
        catch(err){
            res.status(400).send("Not Authorized Token failed");
        }
    }
    if(!token){
        res.status(401).send("Not Logged in");
    }
};