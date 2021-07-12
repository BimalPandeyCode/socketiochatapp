import { configureStore } from "@reduxjs/toolkit";
import logUserIn from "./reducers/auth.js";
import friendsList from "./reducers/friends.js";
import currentMessages from "./reducers/currentMessages.js";
export default configureStore({
  reducer: {
    logUserIn,
    friendsList,
    currentMessages,
  },
});
