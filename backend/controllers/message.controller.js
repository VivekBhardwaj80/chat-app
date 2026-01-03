import uploadOnCloudinary from "../utils/uploadOnCloudinary.js"
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
  try {
    let sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    const receiverSocketId = getReceiverSocketId(receiver)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }
    res.status(201).json({ success: true, message:newMessage });
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({
      success: false,
      message: "send message error",
      error: error.message,
    });
  }
};

const getMessage = async(req,res)=>{
try {
    let sender = req.userId
    let {receiver} = req.params
    let conversation = await Conversation.findOne({
        participants:{$all:[sender,receiver]},
    }).populate("messages")
    if(!conversation){
        return res.status(200).json({success:true,message:[]})
    }
res.status(200).json({success:true,message:conversation.messages})
} catch (error) {
  
    res.status(500).json({success:false,message:"getMessage error",error:error.message})
}
}

export { sendMessage , getMessage};
