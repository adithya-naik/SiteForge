import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
export const serverURL = "http://localhost:8000";
const [user, setUser] = useState(null);
<Navbar user={user} />
<Login setUser={setUser} />
const App = () => {
  useGetCurrentUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;
