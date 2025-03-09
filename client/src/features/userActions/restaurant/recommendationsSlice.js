import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  message: null,
  error: null,
  recommendations: [],
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    getRecommendationsRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
      state.recommendations = null;
    },

    getRecommendationsSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message || "";
      state.recommendations = action.payload.data.recommendations || [];
    },

    getRecommendationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "some error occured";
    },

    
  },
});

export const { getRecommendationsRequest, getRecommendationsSuccess, getRecommendationsFailure } =
  recommendationSlice.actions;

export default recommendationSlice.reducer;
