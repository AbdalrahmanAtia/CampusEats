import axios from "axios";
import {
  deleteProductError,
  deleteProductRequest,
  deleteProductSuccess,
  getProductsFailure,
  getProductsRequest,
  getProductsSuccess,
  uploadProductError,
  uploadProductRequest,
  uploadProductSuccess,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
} from "./productSlice";

export const getProducts = (token, restaurantId) => async (dispatch) => {
  try {
    dispatch(getProductsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include any authorization token if needed
        "Content-Type": "application/json",
      },
    };

    const api_URI = `${import.meta.env.VITE_API_BASE_URI}/users/get-products?restaurantId=${restaurantId}`;

    const res = await axios.get(api_URI, config);

    dispatch(getProductsSuccess(res.data));
  } catch (error) {
    dispatch(getProductsFailure(error.response.data));
    console.log(error);
  }
};

export const deleteProduct = (token, productId) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const api_URI = `${
      import.meta.env.VITE_API_BASE_URI
    }/restaurant/delete-product/${productId}`;

    const res = await axios.delete(api_URI, config);
    dispatch(deleteProductSuccess());
    dispatch(getProducts(token));
  } catch (error) {
    dispatch(deleteProductError("error while deleting product"));
  }
};

export const addProduct = (file, productData, token) => async (dispatch) => {
  try {
    dispatch(uploadProductRequest());

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

    if (file) {
      const data = new FormData();

      data.append("file", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URI}/users/upload-images`,
        data,
        config1
      );

      if (res) {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URI}/restaurant/create-product`,
          productData,
          config2
        );

        dispatch(uploadProductSuccess(res.data));
      }
    }
  } catch (error) {
    console.log(error);
    dispatch(uploadProductError(error.response.data));
  }
};

export const updateProduct = (token, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const api_URI = `${import.meta.env.VITE_API_BASE_URI}/restaurant/update-product/${productData.productId}`;

    // Sending a PUT request to update the product data
    const res = await axios.put(api_URI, productData, config);

    dispatch(updateProductSuccess(res.data)); // Dispatch success action with the updated product data
    dispatch(getProducts(token, productData.restaurantId)); // Refresh the product list

  } catch (error) {
    dispatch(updateProductFailure("Error while updating product"));
    console.error(error);
  }
};



