  import React, { useRef, useState } from "react";
  import dp from "../assets/dp.webp";
  import { IoCameraOutline } from "react-icons/io5";
  import { useDispatch, useSelector } from "react-redux";
  import { IoIosArrowBack } from "react-icons/io";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import axios from "axios";
  import { backendUrl } from "../configs/env";
  import { setUserData } from "../redux/slice/userSlice";
  import { useEffect } from "react";

  const Profile = () => {
    let navigate = useNavigate();
    let { userData } = useSelector((state) => state.user);
    const [name, setName] = useState("");
    const [frontendImage, setFrontendImage] = useState(dp);
    const [backendImage, setBackendImage] = useState(null);
    let image = useRef();
    let [saving, setSaving] = useState(false);
    let dispatch = useDispatch();
    useEffect(() => {
      if (userData) {
        setName(userData.name || "");
        setFrontendImage(userData.image || dp);
      }
    }, [userData]);

    const handleImage = (e) => {
      let file = e.target.files[0];
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    };
    const handleProfile = async (e) => {
      setSaving(true);
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append("name", name);
        if (backendImage) {
          formData.append("image", backendImage);
        }
        let { data } = await axios.put(
          `${backendUrl}/api/v1/user/update-profile`,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          navigate("/")
          setSaving(false);
          dispatch(setUserData(data.user));
        }
      } catch (error) {
        setSaving(false);
        if (error?.response?.data?.message) {
          toast(error.response.data.message);
        } else {
          toast(error.message);
        }
      }
    };

    return (
      <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-10">
        <div
          className="fixed top-[20px] left-[20px]"
          onClick={() => {
            navigate("/");
          }}
        >
          <IoIosArrowBack className="w-[50px] h-[50px] cursor-pointer" />
        </div>
        <div
          className=" bg-white rounded-full border-4 rounded-full border-[#20c7ff] shadow-gray-400 shadow-lg relative"
          onClick={() => {
            image.current.click();
          }}
        >
          <div className="w-[170px] h-[170px]  overflow-hidden rounded-full flex items-center justify-center">
            <img
              src={frontendImage}
              className="w-[100%] h-[100%]"
              alt="default profile"
            />
          </div>
          <div className="absolute bottom-1 right-1  w-[50px] h-[50px] rounded-full bg-[#20c7ff] flex items-center justify-center shadow-gray-400 shadow-lg">
            <IoCameraOutline className="right-3 text-white w-[30px] h-[30px] cursor-pointer " />
          </div>
        </div>
        <form
          className="w-[95%] max-w-[500px] flex flex-col gap-[15px] items-center justify-center ]"
          onSubmit={handleProfile}
        >
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />
          <input
            type="text"
            placeholder="Enter Your name"
            className="w-[90%] h-[43px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px]"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <input
            type="text"
            readOnly
            className="w-[90%] h-[43px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]"
            value={userData?.userName || ""}
          />
          <input
            type="text"
            readOnly
            className="w-[90%] h-[43px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]"
            value={userData?.email || ""}
          />
          <button
            className="bg-[#20c7ff] px-3 py-2 text-white font-semibold rounded-lg cursor-pointer active:scale-90"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    );
  };

  export default Profile;
