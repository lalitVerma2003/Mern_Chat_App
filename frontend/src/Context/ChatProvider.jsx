import {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';

const ChatContext=createContext();

const ChatProvider=({children})=>{
    const [user,setUser]=useState("");
    const [selectedChat,setSelectedChat]=useState();
    const [chats,setChats]=useState([]);
    const [notification,setNotification]=useState([]);
    // const location=useLocation();
    const navigate=useNavigate();

    useEffect(()=>{
        console.log('Setting user..');
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo){
            navigate("/");
        }
    },[navigate]);

    return (<ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>{children}</ChatContext.Provider>)
}

export const ChatState=()=>{
    return useContext(ChatContext);
}

export default ChatProvider;