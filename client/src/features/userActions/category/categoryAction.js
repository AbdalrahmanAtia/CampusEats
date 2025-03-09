import {
  getCategoryFailure,
  getCategoryRequest,
  getCategorySuccess,
} from "./categorySlice";
import axios from "axios";

const getCategory = (token) => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
        withCredentials: true,
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/users/get-categories`,
      config
    );

    dispatch(getCategorySuccess(res.data));
  } catch (error) {
    dispatch(getCategoryFailure(error.response.data));
  }
};

const getMainCategories = (token) => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
        withCredentials: true,
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/users/get-main-categories`,
      config,
    );

    dispatch(getCategorySuccess(res.data));
  } catch (error) {
    dispatch(getCategoryFailure(error.response.data));
  }
};

const getCategoriesByRestaurant = (token, restaurantId) => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
        withCredentials: true,
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/users/get-categories?restaurantId=${restaurantId}`,
      config
    );

    dispatch(getCategorySuccess(res.data));
  } catch (error) {
    dispatch(getCategoryFailure(error.response.data));
  }
};

export { getCategory, getMainCategories, getCategoriesByRestaurant };
