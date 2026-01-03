import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer, toast } from "react-toastify";
import getCurrentUser from "./hooks/getCurrentUser";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { useDispatch, useSelector } from "react-redux";
import getOtherUsers from "./hooks/getOtherUsers";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { backendUrl } from "./configs/env";
import { setOnlineUsers, setSocket } from "./redux/slice/userSlice";

const App = () => {
  let { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  const location = useLocation();

  // hooks
  getCurrentUser(location.pathname);
  getOtherUsers(location.pathname);

  // socket.io connection
  useEffect(() => {
    if (!userData?._id) {
      if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
        dispatch(setOnlineUsers([]));
      }
      return;
    }
    if (userData) {
      const socketIo = io(`${backendUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketIo));
      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData?._id, dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* <Route path='/login' element={<Login />}/> */}
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to={"/profile"} />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/login"} />}
        />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
