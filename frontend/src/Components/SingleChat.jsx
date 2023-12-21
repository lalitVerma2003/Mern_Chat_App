import React, { useEffect, useState } from 'react';
import { Box, FormControl, IconButton, Spinner,Text,Input,useToast, } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import axios from 'axios';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../animation/typing.json";
import { ChatState } from '../Context/ChatProvider';
import { getSender,getSenderFull } from '../config/ChatLogics';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';


const ENDPOINT="http://localhost:3000";
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newMessage,setNewMessage]=useState("");
    const [socketConnected,setSocketConnected]=useState(false);
    const [isTyping,setIsTyping]=useState(false);
    const [typing,setTyping]=useState(false);

    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    const toast=useToast();
    const defaultOptions={
        loop:true,
        autoplay: true,
        animationData: animationData,
        rendererSettings:{
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=> setSocketConnected(true));
        socket.on("typing",()=> setIsTyping(true));
        socket.on("stop typing",()=> setIsTyping(false));
    },[]);


    useEffect(()=>{
        // console.log("Messages");
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    useEffect(()=>{
        socket.on("message received",(newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id)
            {
                if(!notification.includes(newMessageReceived)){
                    // make notifications in database
                    // setNotification([newMessageReceived,...notification]);
                    // setFetchAgain(!fetchAgain);
                    // console.log("Calling function");
                    addNotification(newMessageReceived);
                    // sendNotification();
                    // console.log("Notification sent");
                }
            }else{
                setMessages([...messages,newMessageReceived]);
            }
        });
    },[newMessage]);

    const addNotification=async(newMessageReceived)=>{
        console.log("Notification adding...");
        const config={
            headers:{
                "Content-type":"application/json",
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data}=await axios.post("http://localhost:3000/notification/add",{
            newMessageReceived
        },config);
        console.log("Notification added:",data);
        setNotification([data,...notification]);
        setFetchAgain(!fetchAgain);
    }

    const fetchMessages=async()=>{
        if(!selectedChat){
            return;
        }
        console.log("Selected Chat in fetch msg",selectedChat);
        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`http://localhost:3000/messages/${selectedChat._id}`,config);
            console.log("All Messages:",data);
            setMessages(data);

            socket.emit("join chat",selectedChat._id);
        }
        catch(err){
            toast({
                title: 'Failed to load messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
        }
    }

    const sendMessage=async(e)=>{
        if(e.key==="Enter"&&newMessage){
        socket.emit("stop typing",selectedChat._id);
            try{
                const config={
                    headers:{
                        "Content-type":"application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const {data}=await axios.post("http://localhost:3000/messages",{
                    chatId: selectedChat._id,
                    content: newMessage
                },config);
                console.log("New Message:",data);
                setNewMessage("");

                socket.emit("new message",data);

                setMessages([...messages,data]);
            }
            catch(err){
                toast({
                    title: 'Message not sent',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    positon: "bottom"
                  })
            }
        }
    }

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);

        // Typing Indicating Logic here
        if(!socketConnected)
            return;
        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }
        let lastTypingTime=new Date().getTime();
        var timeLength=3000;
        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;

            if(timeDiff>=timeLength&&typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },3000);
    }

    // console.log("Selected Chat",selectedChat);

  return (
    <>
      {selectedChat?(
        <>
            <Text
                fontSize={{base:"28px",md:"30px"}}
                display={"flex"}
                pb={3}
                px={2}
                w={"100%"}
                fontFamily={"Work sans"}
                justifyContent={{base:"space-between"}}
                alignItems={"center"}
            >
                <IconButton
                    display={{base:"flex",md:"none"}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=> setSelectedChat("")}
                />
                {!selectedChat.isGroupChat?(
                    <>
                    {getSender(user,selectedChat.users)}
                    <ProfileModel user={getSenderFull(user,selectedChat.users)} ></ProfileModel>
                    </>
                ):(
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                    </>
                )}
            </Text>
            <Box
                display={"flex"}
                flexDir={"column"}
                justifyContent={"flex-end"}
                p={3}
                bg={"#E8E8E8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {loading?(
                    <Spinner
                    size={"xl"}
                    w={20}
                    h={20}
                    margin={"auto"}
                    alignSelf={"center"}
                    />
                ):(
                    // <div className='messages'>
                        <ScrollableChat messages={messages} />
                    // </div>
                )}
                {isTyping?
                (<div>
                    <Lottie
                        options={defaultOptions}
                        width={70}
                        style={{marginBottom: 15, marginLeft:0}}
                    />
                </div>):(<div></div>)}
                <FormControl onKeyDown={sendMessage}>
                    <Input
                    variant="filled"
                    bg={"#E0E0E0"}
                    placeholder='Enter a message'
                    value={newMessage}
                    onChange={typingHandler}
                    />
                </FormControl>
            </Box>
        </>
      ):(
        <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p={2}
            h={"100%"}
        >
            <Text fontSize={"4xl"} pb={"3"} fontFamily={"Work sans"} >
                Click on a user to start a chat
            </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat;