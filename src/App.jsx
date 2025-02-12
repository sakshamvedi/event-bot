import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import Tickets from "./pages/Ticket";
import Navbar from "./pages/Navbar";
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  return (
    <>

      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={[<Navbar />, <SignUp />]}></Route>
          <Route path="/events" element={[<Navbar />, <Events />]}></Route>
          <Route path="/tickets" element={[<Navbar />, <Tickets />]}></Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={[<Navbar />, <Login />]} />
          <Route path="/profile" element={[<Navbar />, <Profile />]} />
        </Routes>
      </Router>

    </>
  )
}

export default App
