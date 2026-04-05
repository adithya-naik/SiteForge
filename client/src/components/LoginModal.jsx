import React, { useState } from "react";
import axios from "axios";
import { serverURL } from "../App";

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${serverURL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // --- THIS IS THE FIX ---
        // Dispatch a custom event to notify the useGetCurrentUser hook
        window.dispatchEvent(new Event("auth-change"));
        // -----------------------

        alert("Login Successful!");
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default LoginModal;