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
    sortFriendsListBasedOnIncommingMessage: (state, action) => {
      let incommingFrn = {};
      state.friends = state.friends.filter((frn) => {
        if (frn._id !== action.payload) {
          return frn;
        } else {
          incommingFrn = frn;
        }
      });
      state.friends.unshift(incommingFrn);
    },
    sortFriendsInitially: (state, action) => {
      let includesFriends = new Array(action.payload.length).fill("");
      let notIncludesfriends = [];
      state.friends.forEach((frn) => {
        if (action.payload.includes(frn._id)) {
          let index = action.payload.indexOf(frn._id);
          includesFriends[index] = frn;
        } else {
          notIncludesfriends.push(frn);
        }
      });
      let newCopy = [...includesFriends, ...notIncludesfriends];
      while (newCopy.indexOf("") !== -1) {
        newCopy.splice(newCopy.indexOf("", 1));
      }
      state.friends = newCopy;
    },
  },
});
export const {
  addFriendsToFriendList,
  changeOnlineStatus,
  sortFriendsListBasedOnIncommingMessage,
  sortFriendsInitially,
} = friendsList.actions;
export default friendsList.reducer;
// const example = [
//   {
//     name: "string",
//     image: "string",
//     id: "string",
//   },
// ];
