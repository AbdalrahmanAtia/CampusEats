import {
  getCategoryFailure,
  getCategoryRequest,
  getCategorySuccess,
  uploadCategoryError,
  uploadCategorySuccess,
  uploadCategoryRequest,
} from "./categorySlice";
import axios from "axios";

const getCategory = (token, restaurantId) => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
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



const getMainCategories = (token, adminId) => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/users/get-main-categories`,
      config
    );

    dispatch(getCategorySuccess(res.data));
  } catch (error) {
    dispatch(getCategoryFailure(error.response.data));
  }
};


const getAllCategories = () => async (dispatch) => {
  try {
    dispatch(getCategoryRequest());

    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/users/get-categories`);
    
    dispatch(getCategorySuccess(res.data));
  } catch (error) {
    dispatch(getCategoryFailure(error.response.data));
  }
};

const uploadCategory = (categoryFile, categoryData, token) => async (dispatch) => {
  try {
    dispatch(uploadCategoryRequest());
    
    const config1 = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const config2 = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "Application/json",
      },
    };

    if (categoryFile) {
      const image = new FormData();

      image.append("file", categoryFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URI}/users/upload-images`,
        image,
        config1
      );

      if (res) {
        await axios.post(
        `${import.meta.env.VITE_API_BASE_URI}/restaurant/create-category`,
        categoryData,
        config2
        );

        dispatch(uploadCategorySuccess(res.data));
      }

    }
  } catch (error) {
      console.log(error);
      dispatch(uploadCategoryError(error.response.data));
    }
};

export { getCategory, uploadCategory, getAllCategories, getMainCategories };
