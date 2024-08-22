import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    showNotification(state, action) {
      return {
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideNotification(state, action) {
      return "";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export const createNotification = (message, type, timeout) => {
  return (dispatch) => {
    dispatch(showNotification({ message, type }));
    setTimeout(() => {
      dispatch(hideNotification());
    }, timeout * 1000);
  };
};

export default notificationSlice.reducer;
