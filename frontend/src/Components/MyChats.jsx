import React, { useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider'
import { Button, Stack, useToast,Box,Text } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';



const MyChats = ({fetchAgain}) => {
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
  const toast=useToast();

  const fetchChats=async()=>{
    // console.log("Fetching chats...");
    try{
      const config={
        headers:{
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data}=await axios.get("http://localhost:3000/chats",config);
      setChats(data);
      console.log(data);
    }catch(err){
      toast({
        title: 'Error Occured while fetching chats in MyChats',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: "bottom"
      })
    }
  }

  const fetchNotifications=async()=>{
    // console.log("Inside fetching of notifications");
      try{
          const config={
            headers:{
              Authorization: `Bearer ${user.token}`
            }
          }
          const {data}=await axios.get("http://localhost:3000/notification",config);
          console.log(data);
      }
      catch(err){

      }
  }

  useEffect(()=>{
    fetchChats();
    fetchNotifications();
  },[fetchAgain]);

  return (
    <Box
      display={{base:selectedChat?"none":"flex",md:"flex"}}
      flexDir={'column'}
      alignItems={"center"}
      p={3}
      bg={'white'}
      width={{base:"100%",md:"35%"}}
      borderRadius={"lg"}
      borderWidth={"2px"}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pb={3}
        px={3}
        fontSize={{base:"30px",md:"35px"}}
        fontFamily={"Work sans"}
        w={'100%'}
      >
        My Chats

      <GroupChatModal>
        <Button
          display={'flex'}
          fontSize={{base:"20px",md:"15px",lg:"17px"}}
          rightIcon={<AddIcon/>}
        >New Group Chat</Button>
      </GroupChatModal>
      </Box>

      <Box
        display={'flex'}
        flexDir={"column"}
        p={3}
        bg={"grey"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats?(
          <Stack overflowY={"auto"}
            css={{
              '&::-webkit-scrollbar':{
                width: '15px'
              },
              '&::-webkit-scrollbar-track':{
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb':{
                background: "rgb(112,107,208)",
                backgroundColor: "#5651B7 ",
                borderRadius: '24px'
              },
            }}
          >
            {chats.map((chat)=>(
              <Box
                onClick={()=> setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat===chat?"red":"blue"}
                color={selectedChat===chat?"white":"black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                w={"95%"}
              >
                <Text>
                  {!chat.isGroupChat?(
                    getSender(user,chat.users)
                  ):chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>

    </Box>
  )
}

export default MyChats;
