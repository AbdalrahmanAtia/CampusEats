import { BsCurrencyPound, MdDeleteOutline } from "../../constants";
import { deleteProduct, updateProduct, getProducts } from "../../features/product/productAction";
import "./productList.scss";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

function ProductListChild({ product, toggleEditMode, setToggleEditMode }) {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [editableProduct, setEditableProduct] = useState({ ...product });

  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      dispatch(deleteProduct(token, productId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    dispatch(updateProduct(token, editableProduct));
    setToggleEditMode(false);
  };

  return (
    <div className="product-list-child">
      <div className="product-name-image">
        <img src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${editableProduct.image}`} alt={editableProduct.productName} />
        <input
          type="text"
          name="productName"
          value={editableProduct.productName}
          disabled={!toggleEditMode}
          onChange={handleInputChange}
        />
      </div>

      <div className="product-description">
        <textarea
          name="description"
          value={editableProduct.description}
          disabled={!toggleEditMode}
          onChange={handleInputChange}
          rows={2}
          cols={20}
        />
      </div>

      <div className="product-rating">
        <input
          type="number"
          name="rating"
          value={editableProduct.rating}
          disabled={!toggleEditMode}
          onChange={handleInputChange}
        />
      </div>

      <div className="product-vegetarian">
        <input
          type="text"
          name="vegetarian"
          value={editableProduct.vegetarian ? "veg" : "Non - veg"}
          disabled={!toggleEditMode}
          onChange={handleInputChange}
        />
      </div>

      <div className="product-price">
        <BsCurrencyPound />
        <input
          type="number"
          name="price"
          value={editableProduct.price}
          disabled={!toggleEditMode}
          onChange={handleInputChange}
        />
      </div>

      <div className="user-update">
        {toggleEditMode ? (
          <>
            <button onClick={handleSaveChanges}>Save</button>
            <button onClick={() => setToggleEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setToggleEditMode(true)}>Edit</button>
            <MdDeleteOutline
              onClick={() => handleDeleteProduct(editableProduct.productId)}
              className="icon"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState(useSelector((state) => state.product.products));
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleEditMode, setToggleEditMode] = useState(false);
  
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    dispatch(getProducts(token, user.userId));
  }, [dispatch, token, user.userId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) => 
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="productlist">
      <div className="product-list-wrapper">
        <div className="head">
          <p>Product List</p>
          <input
            type="text"
            placeholder="Search for product..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="product-list-scroll">
          <div className="product-list-header">
            <p>Item</p>
            <p>Description</p>
            <p>Ratings</p>
            <p>Veg</p>
            <p>Price</p>
          </div>
          {filteredProducts?.map((product) => (
            <ProductListChild 
              key={product.productId} 
              product={product} 
              toggleEditMode={toggleEditMode} 
              setToggleEditMode={setToggleEditMode} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}





// import { mealsImage } from "../../assets";
// import { BsCurrencyPound, MdDeleteOutline } from "../../constants";
// import { deleteProduct, getProducts } from "../../features/product/productAction";
// import "./productList.scss";
// import { useDispatch, useSelector } from "react-redux";
// import React, { useEffect, useState } from "react";

// function ProductListChild({ product }) {
//   const [toggleEditMode, setToggleEditMode] = useState(false);
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const handleDeleteProduct = (productId) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this product?');
//     if (confirmDelete) {
//       dispatch(deleteProduct(token, productId));
//     }
//   };

//   return (
//     <div className="product-list-child">
//       <div className="product-name-image">
//         <img src={mealsImage} alt={product.productName} />
//         <input
//           type="text"
//           value={product.productName}
//           disabled={!toggleEditMode}
//         />
//       </div>

//       <div className="product-description">
//         <textarea
//           value={product.description}
//           disabled={!toggleEditMode}
//           rows={2}
//           cols={20}
//         />
//       </div>

//       <div className="product-rating">
//         <input
//           type="number"
//           value={product.rating}
//           disabled={!toggleEditMode}
//         />
//       </div>

//       <div className="product-vegetarian">
//         <input
//           type="text"
//           value={product.vegetarian ? "veg" : "Non - veg"}
//           disabled={!toggleEditMode}
//         />
//       </div>

//       <div className="product-price">
//         <BsCurrencyPound />
//         <input type="number" value={product.price} disabled={!toggleEditMode} />
//       </div>

//       <div className="user-update">
//         <MdDeleteOutline
//           onClick={() => handleDeleteProduct(product.productId)}
//           className="icon"
//         />
//       </div>
//     </div>
//   );
// }

// export default function ProductList() {
//   const [products, setProducts] = useState(
//     useSelector((state) => state.product.products)
//   );
//   const { token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.auth.userData);

//   useEffect(() => {
//     dispatch(getProducts(token, user.userId));
//   }, [dispatch, token, user.userId]);

//   return (
//     <div className="productlist">
//       <div className="product-list-wrapper">
//         <div className="head">
//           <p>Product List</p>
//           <input
//             type="text"
//             placeholder="search for product..."
//             // Add search functionality if needed
//           />
//         </div>

//         <div className="product-list-scroll">
//           <div className="product-list-header">
//             <p>Item</p>
//             <p>Description</p>
//             <p>Ratings</p>
//             <p>Veg</p>
//             <p>Price</p>
//           </div>
//           {products?.map((product) => (
//             <ProductListChild key={product.productId} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
