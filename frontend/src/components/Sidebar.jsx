import React, { useState } from "react";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";

import { IoClose } from "react-icons/io5";
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
import { useEffect } from "react";

const Sidebar = () => {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      let { data } = await axios.get(`${backendUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        dispatch(setUserData(null));
        dispatch(setOtherUsers(null));
        navigate("/login");
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast(error.response.data.message);
      }
      toast(error.message);
    }
  };
  const handleSearch = async () => {
    try {
      let { data } = await axios.get(
        `${backendUrl}/api/v1/user/search?query=${searchInput}`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        dispatch(setSearchData(data.search));
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast(error.response.data.message);
      }
      toast(error.message);
    }
  };
  useEffect(() => {
    if (searchInput) {
      handleSearch();
    }
  }, [searchInput]);

  return (
    <div
      className={`lg:w-[30%] ${
        selectedUser ? "hidden" : "block"
      } overflow-hidden relative lg:block h-[100vh] w-[100%] bg-slate-200`}
    >
      <div
        className="w-[45px] h-[45px] bg-[#20c7ff] flex items-center justify-center rounded-full overflow-hidden shadow-lg shadow-gray-400 cursor-pointer transition-all duration-300 ease-in-out fixed bottom-9 left-2 z-[150]"
        onClick={() => handleLogout()}
      >
        <BiLogOutCircle className="text-[24px] text-white" />
      </div>
      {searchInput && (
        <div className="flex absolute items-center bg-[#fffafa] w-full  h-[500px] top-[250px] overflow-y-auto flex-col gap-[10px] z-[150] shadow-lg">
          {searchData?.map((user, idx) => (
            <div
              key={idx}
              className="group w-[95%] h-[55px] flex items-center gap-[15px] overflow-hidden  bg-white mt-[10px] hover:bg-[#83e0ff] hover:text-white cursor-pointer border-b py-[10px] border-b-gray-500"
              onClick={() => {
                dispatch(setSelectedUser(user));
                setSearchInput("")
                setSearch(false)
              }}
            >
              <div className="relative">
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white">
                  <img
                    src={user?.image || dp}
                    alt="User Profile"
                    className="h-[100%] object-cover object-center"
                  />
                </div>
                {onlineUsers?.includes(user._id) && (
                  <span className="w-[10px] h-[10px] rounded-full bg-[#39ff14] absolute bottom-[6px] right-[-3px] shadow-gray-400 shadow-md"></span>
                )}
              </div>
              <h1 className="text-gray-800 group-hover:text-white font-semibold text-[17px]">
                {user.name || user.userName}
              </h1>
            </div>
          ))}
        </div>
      )}

      <div className='className="w-full h-[230px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex flex-col justify-center px-3'>
        <h1 className="text-white text-[28px] font-bold ">Chatly</h1>
        <div className="w-full flex justify-between items-center mb-2">
          <h1 className="text-gray-800 font-bold text-[25px]">
            Hii, {userData?.name || "user   "}
          </h1>
          <div
            onClick={() => navigate("/profile")}
            className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-lg shadow-gray-400 cursor-pointer bg-white overflow-y-auto py-[10px]"
          >
            <img
              src={userData?.image || dp}
              alt="User Profile"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-[15px]">
          {!search && (
            <div
              className="w-[45px] h-[45px] bg-white flex items-center justify-center rounded-full overflow-hidden shadow-lg shadow-gray-400 cursor-pointer transition-all duration-300 ease-in-out"
              onClick={() => setSearch(true)}
            >
              <IoSearch className="text-[24px]" />
            </div>
          )}
          {search && (
            <form className="w-full h-[45px] bg-white rounded-full px-2 shadow-lg shadow-gray-500 flex items-center gap-[10px]">
              <IoSearch className="text-[24px]" />
              <input
                type="text"
                placeholder="search user..."
                className="w-full h-full outline-0 border-0"
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
              />
              <IoClose
                className="text-[24px] cursor-pointer"
                onClick={() => {
                  setSearch(false);
                }}
              />
            </form>
          )}
          {!search &&
            otherUsers?.map(
              (user, idx) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    className="relative rounded-full shadow-gray-500 bg-white shadow-lg flex items-center mt-[5px] cursor-pointer"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div
                      key={idx}
                      className="w-[45px] h-[45px] bg-white rounded-full overflow-hidden shadow-lg shadow-gray-400 "
                    >
                      <img
                        src={user?.image || dp}
                        alt="User Profile"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <span className="w-[10px] h-[10px] rounded-full bg-[#39ff14] absolute bottom-[6px] right-[-3px] shadow-gray-400 shadow-md"></span>
                  </div>
                )
            )}
        </div>
      </div>
      <div className="w-full h-[60%] overflow-auto flex flex-col gap-[8px] items-center mt-[20px] ">
        {otherUsers?.map((user, idx) => (
          <div
            key={idx}
            className="group w-[95%] h-[50px] flex items-center gap-[15px]  rounded-full overflow-hidden shadow-lg bg-white shadow-gray-400 mt-[10px] hover:bg-[#83e0ff] hover:text-white cursor-pointer"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-500 shadow-lg bg-white">
                <img
                  src={user?.image || dp}
                  alt="User Profile"
                  className="h-[100%] object-cover object-center"
                />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[10px] h-[10px] rounded-full bg-[#39ff14] absolute bottom-[6px] right-[-3px] shadow-gray-400 shadow-md"></span>
              )}
            </div>
            <h1 className="text-gray-800 group-hover:text-white font-semibold text-[17px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
