import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setSelectedUser, setUserData } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // let navigate = useNavigate();
  let navigate = useNavigate()
  let [showPassword, setShowPassword] = useState(false);
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading,setLoading] = useState(false)
  let [err,setErr] = useState("")
let dispatch = useDispatch()

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/")
        dispatch(setUserData(data.user))
        dispatch(setSelectedUser(null))
        setEmail("")
        setPassword("")
        setLoading(false)
        setErr("")
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setLoading(false)
      setErr(error.response.data.message)
    }
  };
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex items-center justify-center">
      <div className="w-full max-w-[450px] h-[500px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        <div className="w-full h-[170px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login to <span className="text-white text-[34px]">chatly</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={loginHandler}
        >
          <input
            type="email"
            placeholder="Enter email"
            className="w-[90%] h-[43px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div className="w-[90%] h-[43px] border-2 border-[#20c7ff] rounded-lg shadow-gray-200 shadow-lg overflow-hidden relative">
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Enter password"
              className="w-full h-full outline-none  px-[20px] py-[10px] bg-white  text-gray-700 text-[19px]"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute top-[6px] right-[10px] text-[#20c7ff] font-semibold cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >{`${showPassword ? "hidden" : "show"}`}</span>
          </div>
          {err && <p className="text-red-500">{err}</p>}
          <button className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg w-[200px] mt-[1px] font-semibold text-white hover:shadow-inner cursor-pointer">
            {loading?"Loading...":"Login"}
          </button>
          <p className="cursor-pointer" onClick={() => navigate("/signup")}>
            Want to create new account ?{" "}
            <span className="text-[#20c7ff] font-bold">Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
