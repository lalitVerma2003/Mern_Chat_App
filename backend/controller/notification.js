import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export async function notifications(req,res){
    console.log("Notifications");
    const notifications=await Notification.find({notification:{$elemMatch:{$eq:""}}});
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