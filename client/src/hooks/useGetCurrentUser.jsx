import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverURL } from "../App";

const useGetCurrentUser = () => {
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/me`, {
          withCredentials: true,
        });

        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentUser();
  },[]);
};

export default useGetCurrentUser;
