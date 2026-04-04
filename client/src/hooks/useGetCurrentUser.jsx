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
        console.log(error);
      }
    };

    getCurrentUser();
  }, []);
};

export default useGetCurrentUser;
