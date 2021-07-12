import { createSlice } from "@reduxjs/toolkit";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    user: {},
  },
  reducers: {
    logUserIn: (state, action) => {
      state.user = { ...action.payload };
      localStorage.setItem("userinfo", action.payload._id);
    },
    logUserOut: (state, action) => {
      localStorage.removeItem("userinfo");
      state.user = {};
    },
  },
});
export const { logUserIn, logUserOut } = userInfo.actions;
export default userInfo.reducer;
