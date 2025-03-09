import axios from "axios";
import {
  getRestaurantsFailure,
  getRestaurantsRequest,
  getRestaurantsSuccess,
} from "./restaurantSlice";
import { getRecommendationsFailure, getRecommendationsRequest } from "./recommendationsSlice";



// export const fetchRestaurantRecommendations = (token, userId) => async (dispatch) => {
//   try {
//     // Remove dispatch call or leave it if required

//     dispatch(getRecommendationsRequest());

//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`, // Include authorization token if needed
//         "Content-Type": "application/json",
//       },
//     };

//     const api_URI = `${import.meta.env.VITE_API_BASE_URI}/users/recommendRestaurants?userId=${userId}`;

//     const res = await axios.get(api_URI, config); // Pass config here, no data param needed for GET

//     dispatch(getRecommendationsSuccess(res.data.data));
//     //console.log("res: ", res.data);
//     console.log("22222222222222222:", res);
//     return res.data.data.recommendations; // Return the restaurants data
//   } catch (error) {
//     dispatch(getRecommendationsFailure(error.response.data));
//     console.log(error);
//   }
// };


export const fetchRestaurantRecommendations = async (token, userId) => {
  try {
    const api_URI = `${import.meta.env.VITE_API_BASE_URI}/users/recommendRestaurants?userId=${userId}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(api_URI, config);
    //console.log("hellooooooo:", res.data.data);

    return res.data.data.restaurants; // Ensure backend sends { restaurants: [...] }
  } catch (error) {
    console.error("Error in fetchRestaurantRecommendations:", error);
    return [];
  }
};



const getRestaurants = (token, restaurantId) => async (dispatch) => {
  try {
    dispatch(getRestaurantsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
      },
    };

    const api_URI = !restaurantId
      ? `${import.meta.env.VITE_API_BASE_URI}/users/get-Restaurants`
      : `${
          import.meta.env.VITE_API_BASE_URI
        }/users/get-Restaurants?restaurantId=${restaurantId}`;

    const res = await axios.get(api_URI, config);


    dispatch(getRestaurantsSuccess(res.data));
    //console.log("res: ", res.data);
    console.log("22222222222222222:", res);
    return res.data.restaurants; // Return the restaurants data
  } catch (error) {
    dispatch(getRestaurantsFailure(error.response.data));
    console.log(error);
  }
};

const getRestaurantsByCategoryId = (token, categoryId) => async (dispatch) => {
  try {
    dispatch(getRestaurantsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
      },
    };

    const api_URI = !categoryId
      ? `${import.meta.env.VITE_API_BASE_URI}/users/get-Restaurants`
      : `${
          import.meta.env.VITE_API_BASE_URI
        }/users/get-Restaurants?categoryId=${categoryId}`;

    const res = await axios.get(api_URI, config);

    dispatch(getRestaurantsSuccess(res.data));
  } catch (error) {
    dispatch(getRestaurantsFailure(error.response.data));
    console.log(error);
  }
};

const getSearchedRestaurants = (token, restaurantName) => async (dispatch) => {
  try {
    dispatch(getRestaurantsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(
      `${
        import.meta.env.VITE_API_BASE_URI
      }/users/get-Restaurants?restaurantName=${restaurantName}`,
      config
    );

    dispatch(getRestaurantsSuccess(res.data));
  } catch (error) {
    dispatch(getRestaurantsFailure(error.response.data));
  }
};

// Add this reset action to your restaurant actions
const resetRestaurantId = () => {
  return {
    type: "RESET_RESTAURANT_ID",
  };
};

export { getRestaurants, getRestaurantsByCategoryId, getSearchedRestaurants, resetRestaurantId };
