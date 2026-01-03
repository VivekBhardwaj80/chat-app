import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../configs/env";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slice/userSlice";

const getCurrentUser = (pathname) => {
  let dispatch = useDispatch();
  // let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    if(pathname === '/login' || pathname === "/signup") return
    const fetchUserDate = async () => {
      try {
        let { data } = await axios.get(`${backendUrl}/api/v1/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(data.findCurrentUser));
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast(error.response.data.message);
        } else {
          toast(error.message);
        }
      }
    };
    fetchUserDate();
  }, [dispatch]);
};
export default getCurrentUser;
