import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "Notification up and running!",
  type: "info"
};

let timeoutId = null

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationAction(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

export const { setNotificationAction, clearNotification } =
  notificationSlice.actions;

export const setNotification = (message , time, type = "info") => {
  return async dispatch => {
    dispatch(setNotificationAction({message, type}));

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    timeoutId = setTimeout(() => 
      dispatch(clearNotification()), 
      (time*1000));
  }
};

export default notificationSlice.reducer;
