import User from '../models/userModel.js';
import { generateToken } from '../config/generateToken.js';
import bcrypt from 'bcryptjs';

export async function createUser(req,res){

    const {name,email,password,pic}=req.body;
    if(!name || !email || !password){
        res.status(400).send("Error Occured in create user");
    }

    const userExist=await User.findOne({email});

    if(userExist){
        res.status(400).send("User ALready Existed");
    }

    const salt=await bcrypt.genSalt(10);
    const hashpassword=await bcrypt.hash(password,salt);

    const newUser=new User({name,email,password:hashpassword,pic});
    await newUser.save();

    if(newUser){
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            password: newUser.password,
            pic: newUser.pic,
            token: generateToken(newUser._id)
        });
    }
    else{
        res.status(400).send("Error occured while creating new user");
    }
}

export async function loginUser(req,res){
    const {email,password}=req.body;

    const user=await User.findOne({email:email});

    if(user&&(await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else{
        res.status(401).send("User not registered");
    }
}

export async function allUsers(req,res){
    const query=req.query.search?{
        $or:[
            {name: {$regex:req.query.search,$options:"i"}},
            {email: {$regex:req.query.search,$options:"i"}}
        ]
    }:{}
    const users=await User.find(query).find({_id:{$ne:req.user._id}});
    res.json(users);
    
}