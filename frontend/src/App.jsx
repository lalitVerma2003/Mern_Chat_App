import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, ButtonGroup } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Components/Home';
import Chat from './Components/Chat';
import ChatProvider from './Context/ChatProvider'

function App() {
  const [count, setCount] = useState(0)

  return (
      <Router>
    <ChatProvider>
    {/* <div className="App"> */}
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/chats" element={<Chat/>} />
        </Routes>

    {/* </div> */}
    </ChatProvider>
      </Router>
  )
}

export default App
