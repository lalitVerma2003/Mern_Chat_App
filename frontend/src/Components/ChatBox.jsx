import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState();

  return (
    <Box
      display={{base:selectedChat?"flex":"none",md:"flex"}}
      w={{base:"100%",md:"64%"}}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      borderRadius={"lg"}
      backgroundColor={"white"}
      borderWidth={"2px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
