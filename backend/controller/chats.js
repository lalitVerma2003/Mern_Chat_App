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
// routes for practice
// export async function accessChats(req,res){
//     const {userId}=req.body;

//     const chat=await Chat.find({
//         isGroupChat: false,
//         $and:[
//             {users:{ $elemMatch:{$eq:req.user._id}}},
//             {users:{ $elemMatch:{$eq:userId}}}
//         ]
//     })
//     if(chat.length>0){
//         console.log('Chat exist');
//         res.send(chat);
//     }
//     else{
//         const user=await User.findById(userId);
//         const chat={
//             chatName:"sender",
//             isGroupChat:false,
//             users:[req.user,user]
//         }
//         const newChat=new Chat(chat);
//         newChat.save();
//         const fullChat=await Chat.findById(newChat._id).populate("users","-password").populate("latestMessage");
//         console.log(fullChat);
//         res.send(fullChat);
//     }
// }

export async function fetchChats(req,res){
    // console.log("Inside of fetching");
    // console.log(req.user);
    try{
        var chats=await Chat.find({users:{$elemMatch:{$eq: req.user._id}}}).populate("users","-password").populate("latestMessage").populate("groupAdmin","-password").sort({updatedAt:-1});
            // console.log(chats);
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
// routes for practice
// export async function fetchChats(req,res){
//     console.log("Fetching");
//     try{
//         var chats=await Chat.find(
//            { users:{$elemMatch:{$eq:req.user._id}}}
//         ).populate("users","-password").populate("latestMessage");
//         chats=await User.populate(chats,{
//             path: "latestMessage.sender",
//             select: "name pic email"
//         });
//         console.log(chats);
//         res.status(200).send(chats);
//     }
//     catch(err){
//         res.status(400).send("Not Fetching Chats");
//     }
// }

export async function createGroupChat(req,res){
    if(!req.body.name || !req.body.users){
        res.status(400).send("Please fill all the fields");
    }

    // console.log(req.body.name,req.body.users);
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
// route for practice
// export async function createGroupChat(req,res){
//     var users=JSON.parse(req.body.users);

//     if(users.length<2){
//         res.status(400).send("Not enough users");
//     }

//     users.push(req.user);

//     var groupChat={
//         chatName: req.body.name,
//         isGroupChat: true,
//         users: users,
//         groupAdmin: req.user
//     }
//     var newGroupChat=(await new Chat(groupChat).populate("users","-password")).populate("groupAdmin");
//     newGroupChat=await User.populate(newGroupChat,{
//         path: "latestMessage.sender",
//         select: "name pic email"
//     });
//     (await newGroupChat).save();
//     const fullGroupChat=await Chat.findById(newGroupChat._id).populate("users","-password").populate("groupAdmin");
//     console.log(fullGroupChat);
//     res.status(200).send(fullGroupChat);
// }

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
// export async function addToGroup(req,res){
//     const {userId,chatId}=req.body;

//     const user=await User.findById(userId);
//     const chat=await Chat.findById(chatId);
//     const newChat=await Chat.findByIdAndUpdate(chatId,{new:true},{
//         $push: {users:user}
//     }).populate("users","-password").populate("latestMessage").populate("groupAdmin");
//     console.log(newChat);
//     res.status(200).send(newChat);
// }

export async function removeFromGroup(req,res){
    const {chatId,userId}=req.body;

    const groupChat=await Chat.findByIdAndUpdate(chatId,{
        $pull:{ users: userId}
    }).populate("users","-password").populate("groupAdmin","-password");
    await groupChat.save();
    res.json(groupChat);
}