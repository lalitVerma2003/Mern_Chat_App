import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app=express();

mongoose.connect(`${process.env.MONGO_URL}/${process.env.MONGO_DATABASE_NAME}`)
    .then(()=>{
        console.log("Mongo Connection formed");
    })
    .catch(err=>{
        console.log("Error Occured");
        console.log(err);
    })
    
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/home",(req,res)=>{
    res.send("Home Page");
})

app.use('/users',userRoutes);
app.use('/chats',chatRoutes);
app.use('/messages',messageRoutes);
app.use('/notification',notificationRoutes);

// PORT undefined, solve it
const PORT=process.env.PORT;
const server=app.listen(PORT,()=>{
    console.log(`Request Listen ${PORT}`);
})
import { Server } from "socket.io";
const io =new Server(server, {
  pingTimeout: 60000,
  cors:{
    origin: `${process.env.FRONTEND_URL}`,
  }
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("User Joined Room: " +room);
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing");
    })

    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing");
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;

        if(!chat.users) return console.log("chat users not defined");
        // console.log(chat.users);

        chat.users.forEach((user)=>{
            if(user._id==newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived);
        });
    });

    socket.off("setup",()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
});