import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import MyChats from './MyChats';
import SideBar from './SideBar';
import ChatBox from './ChatBox';


const Chat = () => {
    const [chats,setChats]=useState("");
    const [fetchAgain,setFetchAgain]=useState(false);
    const {user}=ChatState();

    useEffect(()=>{
        console.log("In chat");
    },[]);

  return (
    <div style={{ width: "100%",
    height: "50%" }}>
      {user && <SideBar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      <Box
      display={'flex'}
      flexDirection={"row"}
      justifyContent="space-between"
      w="100%"
      h="91vh"
      p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default Chat;
