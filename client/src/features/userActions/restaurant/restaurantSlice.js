import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  message: null,
  error: null,
  restaurants: [],
  restaurantId: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    getRestaurantsRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
      state.restaurants = null;
    },

    getRestaurantsSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message || "";
      state.restaurants = action.payload.data.restaurants || [];
    },

    getRestaurantsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "some error occured";
    },

    restaurantReducer: (state = initialState, action) => {
      switch (action.type) {
        case "RESET_RESTAURANT_ID":
          return {
            ...state,
            restaurantId: null, // Reset the restaurantId
          };
        default:
          return state;
      }
    },
    
  },
});

export const { getRestaurantsRequest, getRestaurantsSuccess, getRestaurantsFailure } =
  restaurantSlice.actions;

export default restaurantSlice.reducer;
