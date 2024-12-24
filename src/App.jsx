import { Button } from "@/components/ui/button"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import SignUp from "./pages/Signup";
import Events from "./pages/Events";
import Tickets from "./pages/Ticket";

function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/contact" element={<SignUp />}></Route>
          <Route path="/events" element={<Events />}></Route>
          <Route path="/tickets" element={<Tickets />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
