import React from "react";
import "./categoryItemsCard.scss";
import { allFoodImage } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCategory, getProductsByRestaurant } from "../../features/userActions/product/productAction";

export default function CategoryItemCard({
  id,
  imgSrc,
  itemName,
  activeSlide,
  setActiveSlide,
  categoryId,
  onCategorySelect,
  restaurantId,  // Accept restaurantId as a prop
}) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleOnClick = (id, categoryId) => {
    onCategorySelect(categoryId);
    setActiveSlide(id);
    // Now you can use restaurantId here
    if (categoryId) {
      dispatch(getProductsByCategory(token, categoryId));  // Fetch products for this category
    } else {
      dispatch(getProductsByRestaurant(token, restaurantId));  // Fetch all products for the restaurant
    }
  };

  return (
    <div className="categoryItemCard" onClick={() => handleOnClick(id, categoryId)}>
      <img
        src={imgSrc.startsWith("http") ? imgSrc : `${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${imgSrc}`}
        alt="All"
        loading="lazy"
      />
      <p>{itemName}</p>
      <div className={`curr-sel ${activeSlide === id ? "" : "hide-curr-sel"}`} />
    </div>
  );
}


// import React from "react";
// import "./categoryItemsCard.scss";
// import { allFoodImage } from "../../assets";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductsByCategory, getProductsByRestaurant } from "../../features/userActions/product/productAction";

// export default function CategoryItemCard({
//   id,
//   imgSrc,
//   itemName,
//   activeSlide,
//   setActiveSlide,
//   categoryId,
// }) {
//   const token = useSelector((state) => state.auth.token);
//   const dispatch = useDispatch();

//   const restaurantId = location.state?.restaurantId;


//   const handleOnClick = (id, categoryId) => {
//     itemName === "View All"
//       ? dispatch(getProductsByRestaurant(token, restaurantId))
//       : dispatch(getProductsByCategory(token, categoryId));
//     setActiveSlide(id);
//   };
//   return (
//     <div
//       className="categoryItemCard"
//       onClick={() => handleOnClick(id, categoryId)}
//     >
//       <img
//         src={imgSrc.startsWith("http") ?
//           imgSrc :
//           `${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${imgSrc}`}

//         alt="All"
//         loading="lazy"
//       />
//       <p>{itemName}</p>
//       <div
//         className={`curr-sel ${activeSlide === id ? "" : "hide-curr-sel"} `}
//       />
//     </div>
//   );
// }
