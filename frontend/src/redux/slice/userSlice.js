import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers:[],
    selectedUser:null,
    socket:null,
    onlineUsers:[],
    searchData:null,
  },
  reducers: {
    setUserData:(state,actions)=>{
        state.userData=actions.payload
    },
    setOtherUsers:(state,actions)=>{
        state.otherUsers=actions.payload
    },
    setSelectedUser:(state,actions)=>{
        state.selectedUser=actions.payload
    },
    setSocket:(state,actions)=>{
        state.socket=actions.payload
    },
    setOnlineUsers:(state,actions)=>{
        state.onlineUsers=actions.payload
    },
    setSearchData:(state,action)=>{
      state.searchData=action.payload
    }
  },
});

export const {setUserData,setOtherUsers,setSelectedUser, setOnlineUsers, setSocket,setSearchData} = userSlice.actions;
export default userSlice.reducer;
