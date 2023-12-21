import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken=(id)=>{
    return jwt.sign({user_id:id},process.env.JWT_SECRET,{
        expiresIn: "30d",
    });
};

export {generateToken};