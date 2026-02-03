import React, { useState, useEffect } from "react";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch, IoClose } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import useGetOtherUsers from "../hooks/getOtherUsers";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../configs/env";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { userData, otherUsers, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetOtherUsers();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        dispatch(setUserData(null));
        dispatch(setOtherUsers([]));
        navigate("/login");
      }
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/v1/user/search?query=${searchInput}`,
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(setSearchData(data.search));
      }
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (searchInput) handleSearch();
  }, [searchInput]);

  return (
    <div className={`lg:w-[30%] h-screen w-full bg-slate-200 flex flex-col`}>
      {/* Logout Button */}
      <div
        className="w-[45px] h-[45px] bg-[#20c7ff] flex items-center justify-center rounded-full shadow-lg cursor-pointer fixed bottom-9 left-2 z-[150]"
        onClick={handleLogout}
      >
        <BiLogOutCircle className="text-[24px] text-white" />
      </div>

      {/* Header */}
      <div className="h-[230px] bg-[#20c7ff] rounded-b-[30%] p-4 flex flex-col justify-end">
        <h1 className="text-white text-[28px] font-bold">Chatly</h1>
        <div className="flex justify-between items-center mt-2">
          <h1 className="text-gray-800 font-bold text-[25px]">
            Hii, {userData?.name || "user"}
          </h1>
          <div
            onClick={() => navigate("/profile")}
            className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-lg cursor-pointer bg-white"
          >
            <img
              src={userData?.image || dp}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-4 flex items-center gap-3">
          {!search ? (
            <div
              className="w-[45px] h-[45px] bg-white flex items-center justify-center rounded-full shadow-lg cursor-pointer"
              onClick={() => setSearch(true)}
            >
              <IoSearch className="text-[24px]" />
            </div>
          ) : (
            <form className="flex-1 h-[45px] bg-white rounded-full px-2 shadow-lg flex items-center gap-2">
              <IoSearch className="text-[24px]" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full h-full outline-none border-0"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <IoClose
                className="text-[24px] cursor-pointer"
                onClick={() => {
                  setSearch(false);
                  setSearchInput("");
                }}
              />
            </form>
          )}
        </div>
      </div>

      {/* Scrollable User List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
        {(search && searchInput ? searchData : otherUsers)?.map((user, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 w-full h-[60px] p-2 bg-white rounded-lg shadow-md hover:bg-[#83e0ff] hover:text-white cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden shadow-md">
              <img
                src={user?.image || dp}
                alt="User Profile"
                className="w-full h-full object-cover object-center"
              />
              {onlineUsers?.includes(user._id) && (
                <span className="absolute bottom-1 right-1 w-[12px] h-[12px] rounded-full bg-[#39ff14] shadow-md"></span>
              )}
            </div>
            <h1 className="text-gray-800 font-semibold text-lg truncate">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
