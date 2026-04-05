import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverURL } from "../App";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/me`, {
          withCredentials: true,
        });

        dispatch(setuserData(result.data));
      } catch (error) {
        // If there's an error (like 401 Unauthorized), clear the user data
        dispatch(setuserData(null));
        console.log(error);
      }
    };

    // 1. Run on initial load
    getCurrentUser();

    // 2. Listen for a custom 'auth-change' event 
    // This allows the login page to "tell" this hook to refresh
    window.addEventListener("auth-change", getCurrentUser);

    // 3. Cleanup the listener
    return () => {
      window.removeEventListener("auth-change", getCurrentUser);
    };
  }, [dispatch]); // Added dispatch to dependency array for best practice
};

export default useGetCurrentUser;