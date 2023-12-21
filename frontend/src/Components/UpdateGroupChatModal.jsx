import React, { useState } from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { IconButton,Button, FormControl, useToast,useDisclosure,Input,Box,Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import UserBadgeItem from './UserBadgeItem';
import UserListItem from './UserListItem';
  

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState("");
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const {user,selectedChat,setSelectedChat}=ChatState();
    const toast=useToast();

    const handleRemoveUser=async(userToRemove)=>{
        // only admin can remove users and not other users in group chat
        console.log(selectedChat.groupAdmin,user);
        if(selectedChat.groupAdmin._id!==user._id || userToRemove._id!==user._id){
            toast({
                title: 'Only Admins can remove users',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
            return;
        }
        try{

            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.put("http://localhost:3000/chats/groupremove",{
                userId: userToRemove._id,
                chatId:selectedChat._id
            },config);
            user._id===userToRemove._id?setSelectedChat():setSelectedChat(data);
            console.log(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
        }
        catch(err){
            toast({
                title: 'Error while removing from user',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
        }
    }

    const handleRenameGroup=async()=>{
        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.put("http://localhost:3000/chats/rename",{
                chatId: selectedChat._id,
                chatName: groupChatName
            },config);
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            onClose();
        }
        catch(err){
            toast({
                title: 'Error in renaming',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
              setGroupChatName("");
        }
    }

    const handleSearchResult=async(query)=>{
        if(!query){
            return;
        }
        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`http://localhost:3000/users?search=${query}`,config);
            setSearchResult(data);
        }
        catch(err){
            toast({
                title: 'Error occured',
                description: "problem while fetching users in group modal",
                status: 'error',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
        }
    }

    const handleGroupUser=async(userToAdd)=>{
        if(selectedChat.users.find((u)=> u._id===userToAdd._id)){
            toast({
                title: 'Already Added',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
            return;
        }
        console.log(selectedChat.groupAdmin,user);
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title: 'Only Admins can add users',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
            return;
        }
        try{

            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.put("http://localhost:3000/chats/groupadd",{
                userId: userToAdd._id,
                chatId:selectedChat._id
            },config);
            console.log(data);
            setFetchAgain(!fetchAgain);
        }
        catch(err){
            toast({
                title: 'Error while adding user in group',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
        }
    }

    return (
      <>
        <IconButton display={{base:"flex"}} onClick={onOpen} icon={<ViewIcon/>} />
  
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                fontSize={"35px"}
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={"center"}
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontFamily={"Work sans"} fontSize={"xl"} >admin:</Text>
           <Box display={"flex"} w={"100%"} >
                <UserBadgeItem user={selectedChat.groupAdmin} />
              </Box>
            </ModalBody>
                <Box display={"flex"} flexWrap={"wrap"} width={"100%"} pb={3} >
                    {selectedChat.users.map((user)=>(
                        <UserBadgeItem key={user._id} user={user} handleFunction={()=> handleRemoveUser(user)} />
                    ))}
                </Box>
            <FormControl display={"flex"}>
                <Input
                placeholder='Update Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e)=> setGroupChatName(e.target.value)}
                />
                <Button
                variant={"solid"}
                colorScheme='teal'
                ml={1}
                onClick={handleRenameGroup}
                >Update
                </Button>
            </FormControl>

            <FormControl>
                <Input
                    placeholder='Add User to group'
                    mb={1}
                    onChange={(e)=> handleSearchResult(e.target.value)}
                />
            </FormControl>
            {searchResult.map((user)=>(
                <UserListItem key={user._id} user={user}
                handleFunction={()=> handleGroupUser(user)} />
            ))}

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={()=> handleRemoveUser(user)}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default UpdateGroupChatModal
