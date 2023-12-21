import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export async function notifications(req,res){
    console.log("Notifications");
    const notifications=await Notification.find({notification:{$elemMatch:{$eq:"65439657b37e6f9d809abe95"}}});
    console.log(notifications);
}

export async function addNotification(req,res){
    // console.log(req.body.newMessageReceived);
    const newNotification=new Notification({notification:req.body.newMessageReceived});
    await newNotification.save();
    var fullNotification=await Notification.findById(newNotification._id).populate({
        path: "notification",
        populate:[{
            path: "sender",
            select: "name email pic"
        },
        {
            path: "chat",
            populate:[{
                path: "users",
                model: "User"
            },
            {
                path: "latestMessage",
                model: "Message"
            }
            ]
        }]
    });
    // fullNotification=await Chat.populate(fullNotification,{
    //     path: "notification.chat"
    // })
    // fullNotification=await User.populate(fullNotification,{
    //     path: "notification.sender",
    // });
    // fullNotification=await User.populate(fullNotification,{
    //     path: "notification.chat.latestMessage",
    //     select: "name pic email"
    // });
    // console.log(fullNotification);
    res.status(200).send(fullNotification);
}

export async function deleteNotification(req,res){
    console.log(req.query.notifId);
    const notification=await Notification.findByIdAndDelete(req.query.notifId).populate({
        path: "notification",
        populate:[{
            path: "sender",
            select: "name email pic"
        },
        {
            path: "chat",
            populate:[{
                path: "users",
                model: "User"
            },
            {
                path: "latestMessage",
                model: "Message"
            }
            ]
        }]
    });;
    // console.log(notification);
    res.status(200).send(notification);
}