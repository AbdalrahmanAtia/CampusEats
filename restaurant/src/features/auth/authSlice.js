import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const initialState = {
  loggedIn: false,
  userData: storedUser || {},
  token: token || null,
  message: null,
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.userData = null;
      state.token = null;
    },

    signInSuccess: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload.data.user;
      state.error = null;
      state.token = action.payload.data.accessToken;
      state.message = action.payload.message;
      state.loggedIn = true;
    },

    signInFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "some error occured";
    },

    signUpRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    signUpSuccess: (state, action) => {
      state.isLoading = false;
      state.userData = action.payload.data.user;
      state.error = null;
      state.token = action.payload.data.accessToken;
      state.message = action.payload.message;
      state.loggedIn = true;
    },

    signUpFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "some error occured";
    },

    clearError: (state) => {
      state.error = null; // Clears the error state
    },

    logOut: (state, action) => {
      state.userData = null;
      state.token = null;
    },

    updateUserInfo: (state, action) => {
      state.userData = action.payload.data;
    },

    updateUserAvatar: (state, action) => {
      state.userData.avatar = action.payload;
    },

  },
});

export const { signInRequest,
   signInSuccess,
    signInFailure,
     signUpRequest,
      signUpSuccess,
       signUpFailure,
        logOut,
         clearError,
        updateUserAvatar,
      updateUserInfo, } =
  authSlice.actions;

export default authSlice.reducer;
