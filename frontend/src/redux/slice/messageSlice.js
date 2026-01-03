import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messagesByUser: {},
  },
  reducers: {
    sendMessagesByUser: (state, action) => {
      const { userId, messages } = action.payload;
      state.messagesByUser[userId] = messages;
    },
    addMessageForUser: (state, action) => {
      const { userId, message } = action.payload;
      if (!state.messagesByUser[userId]) {
        state.messagesByUser[userId] = [];
      }
      state.messagesByUser[userId].push(message);
    },
  },
});

export const { sendMessagesByUser, addMessageForUser } = messageSlice.actions;
export default messageSlice.reducer;
