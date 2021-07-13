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
    changeOnlineStatus: (state, action) => {
      for (let index = 0; index < state.friends.length; index++) {
        if (
          action.payload.find(
            (element) => element.userID === state.friends[index]._id
          )
        ) {
          state.friends[index].active = true;
        } else {
          state.friends[index].active = false;
        }
      }
    },
  },
});
export const { addFriendsToFriendList, changeOnlineStatus } =
  friendsList.actions;
export default friendsList.reducer;
// const example = [
//   {
//     name: "string",
//     image: "string",
//     id: "string",
//   },
// ];
