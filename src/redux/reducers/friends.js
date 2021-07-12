import { createSlice } from "@reduxjs/toolkit";

export const friendsList = createSlice({
  name: "friendsList",
  initialState: {
    friends: [],
  },
  reducers: {
    addFriendsToFriendList: (state, action) => {
      state.friends = [...action.payload];
    },
  },
});
export const { addFriendsToFriendList } = friendsList.actions;
export default friendsList.reducer;
// const example = [
//   {
//     name: "string",
//     image: "string",
//     id: "string",
//   },
// ];
