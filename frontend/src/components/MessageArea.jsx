import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/slice/userSlice";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { BiSolidSend } from "react-icons/bi";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../configs/env";
import { addMessageForUser } from "../redux/slice/messageSlice";

const MessageArea = () => {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let messages = useSelector((state) =>
    selectedUser ? state.message.messagesByUser[selectedUser._id] || [] : []
  );
  let dispatch = useDispatch();
  let [showEmoji, setShowEmoji] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let image = useRef();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImage == null) {
      return;
    }
    if (!selectedUser || (!input.trim() && !backendImage)) {
      return;
    }
    setIsLoading(true);
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let { data } = await axios.post(
        `${backendUrl}/api/v1/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(
          addMessageForUser({ userId: selectedUser._id, message: data.message })
        );

        setInput("");
        setBackendImage(null);
        setFrontendImage(null);
      }
    } catch (error) {
      console.error("Send message error:", error);
      if (error?.response?.data?.message) {
        toast(error.response.data.message);
      } else {
        toast(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowEmoji(false);
  };
  const handleImage = (e) => {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  useEffect(() => {
    setInput("");
    setBackendImage(null);
    setFrontendImage(null);
    setShowEmoji(false);
  }, [selectedUser?._id]);
  useEffect(() => {
    if (!socket || !selectedUser?._id) return;
    const handler = (mess) => {
      dispatch(addMessageForUser({ userId: selectedUser._id, message: mess }));
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage");
  }, [socket, selectedUser?._id, dispatch]);

  return (
    <div
      className={`relative lg:w-[70%] h-full ${
        selectedUser ? "flex" : "hidden"
      } lg:block w-[100%] bg-slate-200 border-l border-gray-400`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col">
          <div className="w-full h-[90px] bg-[#6fc3df] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-3 gap-[10px]">
            <div
              className="cursor-pointer"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoMdArrowBack className="w-[35px] h-[35px] text-white" />
            </div>
            <div className="w-[45px] h-[45px] rounded-full overflow-hidden shadow-lg shadow-gray-400 cursor-pointer bg-white">
              <img
                src={selectedUser?.image || dp}
                alt="User Profile"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <h1 className="text-white font-semibold text-[17px]">
              {selectedUser?.name || selectedUser?.userName}
            </h1>
          </div>
          <div className="w-full h-[78vh] md:h-[76vh] lg:h-[73vh] flex flex-col py-[50px] md:py-[30px] lg:py-[40px] px-[10px] gap-[15px] overflow-auto">
            {showEmoji && (
              <div className=" absolute z-50 bottom-24 w-[280px] h-[320px] sm:w-[130px] sm:h-[170px] md:w-[200px] md:h-[250px]  lg:w-[300px] lg:h-[350px] ">
                <EmojiPicker
                  width="100%"
                  height="100%"
                  onEmojiClick={handleEmojiClick}
                />
              </div>
            )}
            {messages?.map((mess) =>
              mess.sender === userData._id ? (
                <SenderMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              ) : (
                <ReceiverMessage
                  key={mess._id}
                  image={mess.image}
                  message={mess.message}
                />
              )
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-gary-700 font-bold text-[50px]">
            Welcome to chatly
          </h1>
          <span className="text-gray-600 font-semibold text-[30px]">
            Chat Friendly !
          </span>
        </div>
      )}
      {selectedUser && (
        <div className="w-full lg:w-[70%] h-[80px] bottom-[15px] fixed  flex items-center justify-center">
          {frontendImage && (
            <img
              src={frontendImage}
              alt="User Image"
              className="w-[70px] sm:w-[70px] md:w-[120px] lg:w-[150px]   absolute bottom-[80px] right-[13%] rounded-lg shadow-lg shadow-gray-400"
            />
          )}

          <form
            className="w-[95%] lg:w-[70%] h-[60px] bg-[#1799c2] rounded-full shadow-lg shadow-gray-400 flex items-center gap-[5px] px-[20px]"
            onSubmit={handleSendMessage}
          >
            <div onClick={() => setShowEmoji((prev) => !prev)}>
              <BsEmojiSmileUpsideDown className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                ref={image}
                hidden
                onChange={handleImage}
              />
            </div>
            <input
              type="text"
              className="w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white"
              placeholder="Message..."
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div onClick={() => image.current.click()}>
              <IoMdImages className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            {
            (input.length != 0 || backendImage != null) && (
              <button>
                <BiSolidSend className="w-[25px] h-[25px] text-white cursor-pointer" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
