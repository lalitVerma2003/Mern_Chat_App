import mongoose from 'mongoose';

const notificationSchema=new mongoose.Schema({
            notification:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }
})

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;