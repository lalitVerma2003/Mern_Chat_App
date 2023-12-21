import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export async function sendMessage(req,res){
    const {chatId,content}=req.body;

    if(!chatId || !content){
        console.log("Inappropriate data for creating message");
        return res.status(400);
    }

    var newMessage={
        sender:req.user._id,
        content: content,
        chat: chatId,
    }

    try{
        var message=new Message(newMessage);

        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path: "chat.users",
            select: "name email pic"
        });

        await message.save();
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage: message
        });
        res.json(message);
    }
    catch(err){
        res.status(400).send("Message not created");
    }

}

export async function allMessages(req,res){
    try{
        const messages=await Message.find({chat: req.params.chatId}).populate("sender","name pic email").populate("chat");

        res.json(messages);
    }
    catch(err){
        res.status(400).send("Error while fetching all messages");
    }
}

export async function deleteMessages(req,res){
    
}