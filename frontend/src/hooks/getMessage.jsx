import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../configs/env";
import { useDispatch, useSelector } from "react-redux";
import { sendMessagesByUser } from "../redux/slice/messageSlice";

const getMessage = (pathname) => {
  let dispatch = useDispatch();
  let { selectedUser, userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (
      !selectedUser ||
      !selectedUser._id ||
      pathname === "/login" ||
      pathname === "/signup"
    )
      return;
    if (selectedUser._id === userData?._id) return;
    const fetchMessage = async () => {
      try {
        let { data } = await axios.get(
          `${backendUrl}/api/v1/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        if (data.success) {
          dispatch(
            sendMessagesByUser({
              userId: selectedUser._id,
              messages: data.message,
            })
          );
        }
      } catch (error) {
        if (selectedUser === null) return;
        else if (
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
    fetchMessage();
  }, [selectedUser, dispatch]);
};
export default getMessage;
