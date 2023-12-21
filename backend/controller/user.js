import User from '../models/userModel.js';
import { generateToken } from '../config/generateToken.js';
import bcrypt from 'bcryptjs';
import matchPassword from '../models/userModel.js';

export async function createUser(req,res){
    // console.log(req.body);
    // res.json({"message":"Data created"});

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
    // console.log(hashpassword);

    const newUser=new User({name,email,password:hashpassword,pic});
    await newUser.save();
    // console.log(newUser);

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
    // console.log(req.body);
    const {email,password}=req.body;

    const user=await User.findOne({email:email});
    // console.log(user);

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
    // regex is used to search string or substring in field 
    const query=req.query.search?{
        $or:[
            {name: {$regex:req.query.search,$options:"i"}},
            {email: {$regex:req.query.search,$options:"i"}}
        ]
    }:{}
    const users=await User.find(query).find({_id:{$ne:req.user._id}});
    // console.log(users);
    res.json(users);
    
}