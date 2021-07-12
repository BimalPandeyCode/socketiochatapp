import { createSlice } from "@reduxjs/toolkit";

export const currentMessages = createSlice({
  name: "currentMessages",
  initialState: {
    messages: [],
  },
  reducers: {
    loadFirstMessages: (state, action) => {
      let copy = action.payload.sort((a, b) => a.sentTime - b.sentTime);
      state.messages = copy;
    },
    addSentMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    addReceivedMessage: (state, action) => {
      state.messages = [...action.payload];
    },
  },
});
export const { loadFirstMessages, addSentMessage, addReceivedMessage } =
  currentMessages.actions;
export default currentMessages.reducer;

// const example = [
//   { sentTime: 1234, message: "abcd", sentBy: "qwer", sentTo: "tyui" },
//   { sentTime: 1234, message: "abcd", sentBy: "qwer", sentTo: "tyui" },
// ];
