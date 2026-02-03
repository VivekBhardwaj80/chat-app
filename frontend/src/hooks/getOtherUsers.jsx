import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../configs/env";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/slice/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/v1/user/allUsers`,
          { withCredentials: true }
        );

        if (data?.users) {
          // Exclude the logged-in user
          
          const otherUsersFiltered = data.users.filter(
            (user) => user._id !== userData._id
          );
          dispatch(setOtherUsers(otherUsersFiltered));
        }
      } catch (error) {
        toast(error?.response?.data?.message || error.message);
      }
    };

    fetchUsers();
  }, [userData, dispatch]);
};

export default useGetOtherUsers;
