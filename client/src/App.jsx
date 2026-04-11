import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import WebsiteEditor from "./pages/Editor";

export const serverURL = "http://localhost:8000";

const App = () => {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={userData ? <Dashboard /> : <Home />}
        />
        <Route
          path="/generate"
          element={userData ? <Generate /> : <Home />}
        />
        <Route
          path="/editor/:id"
          element={userData ? <WebsiteEditor /> : <Home />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
