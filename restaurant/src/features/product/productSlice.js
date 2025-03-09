import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  message: null,
  success: false,
  error: null,
  product: {},
  products: [], // for getting all products
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductsRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
      state.products = null;
    },

    getProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message || "";
      state.products = action.payload.data.products || [];
    },

    getProductsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "Some error occurred";
    },

    deleteProductRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
    },

    deleteProductSuccess: (state) => {
      state.isLoading = false;
      state.message = "Deleted product";
    },

    deleteProductError: (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload || "Some error occurred while deleting product";
    },

    uploadProductRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
      state.product = {};
      state.success = false;
    },

    uploadProductSuccess: (state, action) => {
      state.isLoading = false;
      state.message = action.payload.message || "";
      state.success = true;
    },

    uploadProductError: (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload.message || "Some error occurred while uploading product";
    },

    // New Update Product Actions
    updateProductRequest: (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
    },

    updateProductSuccess: (state, action) => {
      state.isLoading = false;
      state.message = "Product updated successfully";
      
      // Updating the product in the state
      state.products = state.products.map((product) =>
        product._id === action.payload.data._id ? action.payload.data : product
      );
    },

    updateProductFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message || "Error updating product";
    },
  },
});

export const {
  uploadProductError,
  uploadProductRequest,
  uploadProductSuccess,
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductError,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
} = productSlice.actions;

export default productSlice.reducer;
