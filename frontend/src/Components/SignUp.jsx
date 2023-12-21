import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { FormControl, FormLabel,Input, InputRightElement,InputGroup, VStack,Button,useToast } from '@chakra-ui/react';
import axios from 'axios';


const SignUp = () => {
  const [show, setShow] = useState(true);
  const [showConfirm,setShowConfirm]=useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const toast = useToast();
  const navigate=useNavigate();
  const process=import.meta.env;

  const setImage=(pics)=>{
    // console.log(pics);

    if(pics===undefined){
      console.log("Select an image");
      return;
    }

    const data=new FormData();
    data.append("file",pics);
    data.append("upload_preset",process.VITE_UPLOAD_PRESET);
    data.append("cloud_name",process.VITE_CLOUD_NAME);
    fetch(`https://api.cloudinary.com/v1_1/${process.VITE_CLOUD_NAME}/image/upload`,{
      method: "POST",
      mode: "cors",
      body: data
    }).then((res)=> res.json())
      .then((data)=>{
        console.log(data);
        setPic(data.url.toString());
        console.log(pic);
      })
      
  }

  const handleForm = async (e) => {
    if(password!==confirmpassword){
      toast({
        title: 'Confirm password must be equal to password',
        status: 'error',
        duration: 4000,
        isClosable: true,
        positon: "bottom"
      })
      return;
    }
    
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      };
      // console.log(pic);
      const { data } = await axios.post("http://localhost:3000/users/register", { name, email, password,pic }, config);
      console.log(data);
      toast({
        title: 'Registrartin Successfull',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: "bottom"
      })

      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats");
    }
    catch (err) {
      toast({
        title: 'Error occured',
        description: "Check again before signup",
        status: 'error',
        duration: 5000,
        isClosable: true,
        positon: "bottom"
      })
      navigate("/");
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="name">
        <FormLabel>Name:</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email">
        <FormLabel>Enter email:</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Enter password:</FormLabel>
        <InputGroup>
          <Input
            type={show ? "password" : "text"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
              {show ? 'Show' : 'Hide'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmpassword">
        <FormLabel>Enter confirm password:</FormLabel>
        <InputGroup>
          <Input
            type={showConfirm ? "password" : "text"}
            placeholder="Enter confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? 'Show' : 'Hide'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </FormControl>
      <Button colorScheme='green' width="30%"
        onClick={handleForm}>Sign Up</Button>
    </VStack>
  )
}

export default SignUp;
