import React, { useState } from 'react';
import { FormControl, Input, useDisclosure, useToast,Button,Box } from '@chakra-ui/react';
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
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';


const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupName,setGroupName]=useState("");
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const {user,chats,setChats}=ChatState();
    const toast=useToast();

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

    const handleGroup=(userToAdd)=>{
        console.log("User Added");
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: 'Already Added',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
              return;
        }

        setSelectedUsers([userToAdd,...selectedUsers]);
        console.log(selectedUsers);
    }

    const deleteFunction=(user)=>{
        setSelectedUsers(selectedUsers.filter((sel)=> sel._id!==user._id));
    }

    const handleSubmit=async()=>{
        if(!groupName || selectedUsers.length<2){
            toast({
                title: 'Does Not Exist',
                description: "Please choose atleast 2 users",
                status: 'error',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
            return;
        }
        try{
            const config={
                headers:{
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.post("http://localhost:3000/chats/group",{
                name: groupName,
                users: JSON.stringify(selectedUsers)
            },config);
            console.log(user);
            setChats([data,...chats]);
            setSearchResult([]);
            setSelectedUsers([]);
            onClose();
            toast({
                title: 'Group Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
        }
        catch(err){
            toast({
                title: 'Error occured',
                description: "Error while creating new group chat",
                status: 'error',
                duration: 5000,
                isClosable: true,
                positon: "bottom"
              })
        }
    }

    return (
      <>
      <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
                 display={"flex"}
                 fontFamily={"Work sans"}
                 fontSize={"35px"}
                 justifyContent={"center"}
            >New Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody
               display={'flex'}
               flexDir={"column"}
               alignItems={"center"}
            >
                <FormControl>
                    <Input placeholder='Chat Name' mb={3} onChange={(e)=> setGroupName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='select users for chat' mb={1} onChange={(e)=> handleSearchResult(e.target.value)}/>
                </FormControl>

            <Box display={"flex"} flexWrap={"wrap"} w={"100%"} >
                {selectedUsers.map((user)=>(
                    <UserBadgeItem key={user._id} user={user} handleFunction={()=> deleteFunction(user)} />
                ))}
            </Box>

                {loading?(
                    <span>loading</span>
                ):(
                    searchResult?.slice(0,4).map((user)=>(
                        <UserListItem key={user._id} user={user}
                        handleFunction={()=> handleGroup(user)} />
                    ))
                )}
            
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                 Create Group Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
  )
}

export default GroupChatModal;
