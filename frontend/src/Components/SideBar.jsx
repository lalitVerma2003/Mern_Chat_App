import React, { useState } from 'react';
import { Box,Button,Tooltip,Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, useToast,IconButton,Input,useDisclosure } from '@chakra-ui/react';
import {BellIcon,ChevronDownIcon,SearchIcon} from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import axios from 'axios';
import ProfileModel from './ProfileModel';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import { ChatState } from '../Context/ChatProvider';
import { getSender } from '../config/ChatLogics';

    
const SideBar = ({fetchAgain,setFetchAgain}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const {user,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();

    const navigate=useNavigate();

    const logOutHandle=()=>{
        localStorage.removeItem("userInfo");
        navigate("/");
        toast({
            title: 'Welcome,must visit again',
            status: 'success',
            duration: 4000,
            isClosable: true,
            position: "bottom"
          })
    }

    const handleSearch=async()=>{
        if(!search){
            toast({
                title: 'Please fill first',
                status: 'warning',
                duration: 4000,
                isClosable: true,
                position: "top-left"
              })
            return;
        }

        try{
            setLoading(true);
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const result=await axios.get(`http://localhost:3000/users?search=${search}`,config);
            setSearchResult(result.data);
            setLoading(false);
        }
        catch(err){
            toast({
                title: 'Error Occured while fetching chats',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
        }
    }

    const accessChats=async(userId)=>{
        console.log("creating Chat...");
        try{
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const {data}=await axios.post("http://localhost:3000/chats",{userId},config);

            if(!chats.find((c)=> c.id===data.id)){
                setChats([data,...chats]);
            }

            console.log(data);
            setSelectedChat(data[0]);
            setFetchAgain(!fetchAgain);
            onClose();
        }
        catch(err){
            toast({
                title: 'Error Occured while accessing chats',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: "bottom"
              })
        }
    }

    const deleteNotification=async(notif)=>{
        const config={
            headers:{
                "Content-type":"application/json",
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data}=await axios.delete(`http://localhost:3000/notification/delete?notifId=${notif._id}`,config);

        // console.log(data.notification,data.notification.chat);
        setSelectedChat(data.notification.chat);
        setNotification(notification.filter((n)=> n!==notif));
    }

  return (
    <>
    <Box
        display='flex'
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        h={"9vh"}
        p="5px 10px 5px 10px"
        borderWidth="5px"
    >
        <Tooltip hasArrow label='Search users to chat' bg='gray.300' color='black' placement='bottom'>
            <Button variant="ghost" onClick={onOpen}>

            <IconButton aria-label='Search database' icon={<SearchIcon />} />

            <Text display={{base:"none",md:"flex"}} px="4px">
                Search users
            </Text>
            </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily={"Work sans"} >
            GUP-SHUP
        </Text>
        <div>
        <Menu>
            <MenuButton p={1}>
                <BellIcon fontSize={'2xl'} m={1} />
            </MenuButton>
            <MenuList pl={2} >
                {!notification.length && "No New Messages"}
                {notification.map((notif)=>(
                    <MenuItem key={notif._id} onClick={()=> {
                        deleteNotification(notif);
                    }} >
                    {notif.notification.chat.isGroupchat?`New message in ${notif.notification.chat.chatName}`:`New message in ${getSender(user,notif.notification.chat.users)}`}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                />
            </MenuButton>
            <MenuList>
                <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider/>
                <MenuItem onClick={logOutHandle}>Log Out</MenuItem>
            </MenuList>
        </Menu>
        </div>
    </Box>

    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
    >
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerCloseButton/>
            <DrawerHeader>Search users</DrawerHeader>

            <DrawerBody>
                <Box display={"flex"} pb={2} 
                >
                <Input placeholder="search users" mr={2} value={search} onChange={(e)=> setSearch(e.target.value)} />
                <Button onClick={handleSearch}>Go</Button>
                </Box>

                {/* User chats data */}
                {loading?(<ChatLoading/>):(
                    searchResult.map((user)=>(
                        <UserListItem key={user._id} user={user}  handleFunction={()=> accessChats(user._id)} />
                    ))
                )}
            </DrawerBody>
        </DrawerContent>

    </Drawer>
    </>
  )
}

export default SideBar;
