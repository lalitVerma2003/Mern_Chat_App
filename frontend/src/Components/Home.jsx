import React, { useEffect } from 'react';
import { Container, Box, Text,Tab,TabList,Tabs,TabPanel,TabPanels } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

const Home = () => {
    const navigate=useNavigate();

    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"));
        if(user){
            navigate("/chats");
        }
    });


    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                p={3}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily={"Work sans"}>GUP-SHUP</Text>
            </Box>
            <Box
                bg={"white"} w="100%" p={4} borderRadius="lg" borderWidth="1px"
            >
                <Tabs variant='soft-rounded'>
                    <TabList>
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Home;
