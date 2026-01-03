import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

const ReceiverMessage = ({ image, message }) => {
  let { selectedUser } = useSelector((state) => state.user);
  let scroll = useRef();
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);
  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex gap-[10px]">
      <div
        className="w-[30px] h-[30px] rounded-full overflow-hidden shadow-lg shadow-gray-400 cursor-pointer bg-white top-0 left-0"
      >
        <img
          src={selectedUser?.image || dp}
          alt="User Profile"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div
        className="w-fit max-w-1/2 px-[20px] py-[10px] bg-[#6fc3df] text-white text-[18px] rounded-tl-none rounded-2xl relative  shadow-lg shadow-gray-400flex flex-col gap-[7px]"
        ref={scroll}
      >
        {image && (
          <img
            src={image}
            alt="Sending Image"
            className="w-[130px] rounded-lg"
            onLoad={handleImageScroll}
          />
        )}

        {message && <span>{message}</span>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
