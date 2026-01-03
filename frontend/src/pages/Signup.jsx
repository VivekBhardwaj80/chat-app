import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom";

const Signup = () => {
  // let navigate = useNavigate();
  let navigate = useNavigate()
  let [showPassword, setShowPassword] = useState(false);
  let backendUrl = import.meta.env.VITE_BACKEND_URL;
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false)
let [err,setErr] = useState("")
let dispatch = useDispatch();

  const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );
      if (data.success) {
        navigate("/profile")
        setEmail("")
        setPassword("")
        setUserName("")
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
            Welcome to <span className="text-white text-[34px]">chatly</span>
          </h1>
        </div>
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={signUpHandler}
        >
          <input
            type="text"
            placeholder="Enter username"
            className="w-[90%] h-[43px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-200 shadow-lg text-gray-700 text-[19px]"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
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
          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg w-[200px] mt-[1px] font-semibold text-white hover:shadow-inner cursor-pointer"
          >
            {loading?"Loading...":"Sign Up"}
          </button>
          <p className="cursor-pointer" onClick={() => navigate("/login")}>
            Already have an account ?{" "}
            <span className="text-[#20c7ff] font-bold">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
