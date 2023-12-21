import React from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { IconButton,useDisclosure,Button,Image,Text } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';


const ProfileModel = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    {/* If profile model is empty then it will show eye icon otherwise My Profile text button */}
      {children?(<span onClick={onOpen}>{children}</span>):(
        <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
      )}
       <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader
          display={"flex"}
          fontSize={"40px"}
          fontFamily={"Work sans"}
          justifyContent={"center"}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Image
            borderRadius={"full"}
            boxSize={"170px"}
            src={user.pic}
            alt={user.name}
            />
            <Text fontSize={"3xl"} fontFamily={"Work sans"} py={"0px"}>Email:{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
