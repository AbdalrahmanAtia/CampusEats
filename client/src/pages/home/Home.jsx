import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import CategoriesCarousel from "../../components/categoriesCarousel/CategoriesCarousel";
import { motion } from "framer-motion";
import { fadeIn, menuVars, slideIn } from "../../utils/motion";
import FoodItemCard from "../../components/foodItemsCard/FoodItemCard";
import { foodItems } from "../../constants";
import CartItems from "../../components/cartItems/CartItems";
import context from "../../context/context";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByRestaurant, getProductsByCategory } from "../../features/userActions/product/productAction";

export default function Home() {
  const { isToggleCart, setIsToggleCart } = useContext(context);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const product = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();  // Use the useLocation hook to get the state
  const restaurantId = location.state?.restaurantId;  // Access restaurantId from location.state
  //console.log("Received restaurantId on /items page:", restaurantId);

  useEffect(() => {
    if (restaurantId) {
      dispatch(getProductsByRestaurant(token, restaurantId));
    }
  }, [restaurantId, dispatch, token]);

  const handleCategorySelect = (categoryId) => {
    if (categoryId) {
      // Fetch products for the selected category
      dispatch(getProductsByCategory(token, categoryId));
      setSelectedCategory(categoryId);
    } else {
      // Reset and fetch all products for the restaurant
      dispatch(getProductsByRestaurant(token, restaurantId));
      setSelectedCategory(null);
    }
  };

  const filteredProducts = selectedCategory
    ? product.products?.filter((item) => item.categoryId === selectedCategory)
    : product.products;

  return (
    <div className="home">
      <OutsideClickHandler onOutsideClick={() => isToggleCart && setIsToggleCart(false)}>
        <Navbar />
        {isToggleCart && (
          <motion.div
            className="cart"
            variants={menuVars}
            initial="initial"
            animate="animate"
          >
            <CartItems />
          </motion.div>
        )}
      </OutsideClickHandler>

      <div className="home-wrapper">
        <motion.div
          variants={fadeIn("down", "spring", 0.1, 2)}
          initial="hidden"
          animate="show"
          className="category-div"
        >
          <CategoriesCarousel onCategorySelect={handleCategorySelect} />
        </motion.div>

        <motion.div
          variants={slideIn("left", "spring", 0.1, 3)}
          initial="hidden"
          animate="show"
        >
          <h1 className="category-name">Items</h1>
        </motion.div>
        <div className="food-items-wrapper">
          {filteredProducts?.map((item) => (
            <FoodItemCard
              key={item.productId}
              name={item.productName}
              desc={item.description}
              price={item.price}
              rating={item.rating}
              image={item.image}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}





// import React, { useContext, useEffect, useState } from "react";
// import "./home.scss";
// import Navbar from "../../components/navbar/Navbar";
// import CategoriesCarousel from "../../components/categoriesCarousel/CategoriesCarousel";
// import { motion } from "framer-motion";
// import { fadeIn, menuVars, slideIn } from "../../utils/motion";
// import FoodItemCard from "../../components/foodItemsCard/FoodItemCard";
// import { foodItems } from "../../constants";
// import CartItems from "../../components/cartItems/CartItems";
// import context from "../../context/context";
// import OutsideClickHandler from "react-outside-click-handler";
// import { useDispatch, useSelector } from "react-redux";
// import { getProductsByRestaurant } from "../../features/userActions/product/productAction";

// export default function Home() {
//   const { isToggleCart, setIsToggleCart } = useContext(context);

//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const product = useSelector((state) => state.product);

//   const restaurantId = location.state?.restaurantId;

//   useEffect(() => {
//     if (restaurantId) {
//       //console.log("Restaurant ID:", restaurantId);
//       dispatch(getProductsByRestaurant(token, restaurantId));
//     }
//   }, [restaurantId]);


//   return (
//     <div className="home">
//       <OutsideClickHandler
//         onOutsideClick={() => isToggleCart && setIsToggleCart(false)}
//       >
//         <Navbar />
//         {isToggleCart && (
//           <motion.div
//             className="cart"
//             variants={menuVars}
//             initial="initial"
//             animate="animate"
//           >
//             <CartItems />
//           </motion.div>
//         )}
//       </OutsideClickHandler>

//       <div className="home-wrapper">
//         <motion.div
//           variants={fadeIn("down", "spring", 0.1, 2)}
//           initial="hidden"
//           animate="show"
//           className="category-div"
//         >
//           <CategoriesCarousel />
//         </motion.div>

//         <motion.div
//           variants={slideIn("left", "spring", 0.1, 3)}
//           initial="hidden"
//           animate="show"
//         >
//           <h1 className="category-name">Items</h1>
//         </motion.div>
//         <div className="food-items-wrapper">
//           {product.products?.map((item) => (
//             <FoodItemCard
//               key={item.productId}
//               name={item.productName}
//               desc={item.description}
//               price={item.price}
//               rating={item.rating}
//               image={item.image}
//               item={item}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
