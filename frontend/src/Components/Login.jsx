import React,{ useState } from 'react';
import { InputGroup, VStack,FormControl,FormLabel,Input,InputRightElement,Button,useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [show,setShow]=useState(true);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const toast=useToast();
    const navigate=useNavigate();

    const handleForm=async()=>{
      // console.log("Login func");
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        };
        const { data } = await axios.post("http://localhost:3000/users/login", { email, password }, config);
        console.log(data);
        toast({
          title: 'Login Successfull',
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
          description: "Check again before login",
          status: 'error',
          duration: 5000,
          isClosable: true,
          positon: "bottom"
        })
      }
    }

  return (
    <VStack>
      <FormControl id="email">
      <FormLabel>Enter email:</FormLabel>
        <Input
            placeholder="Enter your email" value={email}
            onChange={(e)=> setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
      <FormLabel>Enter password:</FormLabel>
        <InputGroup>
        <Input
            type={show?"password":"text"}
            placeholder="Enter password" value={password}
            onChange={(e)=> setPassword(e.target.value)}
        />
        <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={()=> setShow(!show)}>
          {show ? 'Show' : 'Hide'}
        </Button>
      </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button onClick={handleForm} colorScheme='blue' width="30%" 
      >Login</Button>
      <Button onClick={()=> {setEmail("guest@example.com"); setPassword("12345678");}} colorScheme='red' width="50%" 
     >Get Guest User Crendials</Button>
      </VStack>
  )
}

export default Login
