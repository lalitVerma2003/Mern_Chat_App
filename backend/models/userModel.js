import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema=new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    pic:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
    },
    {
        timestamps: true
    }
    );

// Revise 100 times It's a model function
userSchema.methods.matchPassword=async function(enteredPassword){
    console.log(this.password,enteredPassword);
    return await bcrypt.compare(enteredPassword,this.password);
}

const User=mongoose.model("User",userSchema);

export default User;