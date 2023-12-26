import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export async function accessChats(req,res){
    const {userId}=req.body;
    // console.log(userId,req.user);

    var isChat=await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    })
    .populate("users","-password")
    .populate("latestMessage");

    isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select: "name email pic"
    });

    if(isChat.length>0){
        console.log("Chat exist");
        res.send(isChat);
    }
    else{
        const user=await User.findById(userId);
        var newChat={
            chatName: "sender",
            isGroupChat: false,
            users: [req.user,user],
        };
        // console.log(newChat);

        try{
            const createChat=new Chat(newChat);
            await createChat.save();
            console.log(createChat);
            const fullChat=await Chat.findById(createChat._id).populate("users","-password");
            // console.log(fullChat);
            res.status(200).send(fullChat);
        }
        catch(err){
            res.status(400).send("Error Occured while creating chat");
        }
    }
}

export async function fetchChats(req,res){
    try{
        var chats=await Chat.find({users:{$elemMatch:{$eq: req.user._id}}}).populate("users","-password").populate("latestMessage").populate("groupAdmin","-password").sort({updatedAt:-1});
            chats=await User.populate(chats,{
                path: "latestMessage.sender",
                select: "name email pic"
            });
            res.status(200).send(chats);

    }
    catch(err){
        res.status(400).send("Error in fetching chats");
    }
}

export async function createGroupChat(req,res){
    if(!req.body.name || !req.body.users){
        res.status(400).send("Please fill all the fields");
    }

    var users=JSON.parse(req.body.users);

    if(users.length<2){
        res.status(400).send("Add more members");
    }

    users.push(req.user);

    try{

        const groupChat=new Chat({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        });
        await groupChat.save();
        const fullGroupChat=await Chat.findById(groupChat._id).populate("users","-password").populate("groupAdmin","-password");
        res.status(200).send(fullGroupChat);
    }
    catch(err){
        res.status(400).send("Error in creating group chat");
    }

}

export async function renameGroup(req,res){
    const {chatId,chatName}=req.body;

    try{
        const chat=await Chat.findByIdAndUpdate(chatId,{ chatName: chatName },{new:true}).populate("users","-password").populate("groupAdmin","-password");
        res.json(chat);
    }
    catch(err){
        res.status(400).send("Error in renaming group name");
    }

}

export async function addToGroup(req,res){
    const {userId,chatId}=req.body;

    const addUser=await User.findById(userId);
    const groupChat=await Chat.findByIdAndUpdate(chatId,{
        $push:{ users: addUser}
    }).populate("users","-password").populate("groupAdmin","-password");
    await groupChat.save();
    res.json(groupChat);
}

export async function removeFromGroup(req,res){
    const {chatId,userId}=req.body;

    const groupChat=await Chat.findByIdAndUpdate(chatId,{
        $pull:{ users: userId}
    }).populate("users","-password").populate("groupAdmin","-password");
    await groupChat.save();
    res.json(groupChat);
}