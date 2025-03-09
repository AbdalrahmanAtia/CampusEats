import React, { useEffect, useState } from "react";
import "./restaurantHome.scss";
import RestaurantNavbar from "../../components/restaurantsNavbar/RestaurantsNavbar";
import CategoriesCarouselMain from "../../components/categoriesCarousel/CategoriesCarouselMain";
import { motion } from "framer-motion";
import { fadeIn, slideIn } from "../../utils/motion";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurants, resetRestaurantId, fetchRestaurantRecommendations } from "../../features/userActions/restaurant/restaurantAction";
import { useNavigate } from "react-router-dom";

// Assuming you already have the function to fetch recommendations from your API.

export default function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const restaurantData = useSelector((state) => state.restaurant);
  const user = useSelector((state) => state.auth.userData);

  //const recommendedRestaurants = useSelector((state) => state.recommendation);


  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants and reset restaurantId when the page loads
    dispatch(getRestaurants(token));
    dispatch(resetRestaurantId());
    // dispatch(fetchRestaurantRecommendations(token, user?.userId ));


    // console.log("RRRRRestaurants:", restaurantData);
    // console.log("Recommendations:", recommendedRestaurants);

    // Fetch recommended restaurants
    const getRecommendations = async () => {
        if (!token || !user?.userId) {
          console.warn("Token or User ID missing, skipping recommendations fetch.");
          return;
        }

        console.log("Fetching recommendations for user: ", user?.userId);
        const recommendations = await fetchRestaurantRecommendations(token, user?.userId).then((data) => {
          // Assuming the data structure has "restaurants" as an array
          setRecommendedRestaurants(data || []);
        })
        .catch((error) => {
          console.log("Error fetching restaurant recommendations:", error);
        });

    };
    getRecommendations();  // Call the async function
  }, [dispatch, token, user?.userId]);

  const handleRedirect = (restaurant) => {
    // Navigate to the 'items' page with the restaurantId
    console.log("Restaurant ID being passed:", restaurant.restaurantId);
    navigate("/items", { state: { restaurantId: restaurant.restaurantId } });
  };

  return (
    <div className="homepage">
      <RestaurantNavbar />
      <div className="homepage-wrapper">
        {/* Categories Carousel Section */}
        <motion.div
          variants={fadeIn("down", "spring", 0.1, 2)}
          initial="hidden"
          animate="show"
          className="categories-section"
        >
          <CategoriesCarouselMain />
        </motion.div>

        {/* Recommended Restaurants Section */}
        {recommendedRestaurants && (
          <motion.div
            variants={slideIn("left", "spring", 0.1, 3)}
            initial="hidden"
            animate="show"
            className="recommended-restaurants-section"
          >
            <h1 className="section-title">Recommended Restaurants</h1>
            <div className="restaurants-list">
              {recommendedRestaurants.map((rest) => (
                <motion.div
                  key={rest.restaurantId}
                  className="restaurant-card"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleRedirect(rest)}
                >
                  <img
                    src={
                      rest.avatar && rest.avatar.startsWith("http")
                        ? rest.avatar
                        : `${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${rest.avatar || "noRestaurant.png"}`} alt={rest.name}
                    className="restaurant-image"
                  />
                  <div className="restaurant-info">
                    <h2>{rest.name}</h2>
                    <p>{rest.description}</p>
                    <span className="rating">⭐ {rest.rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Restaurants Section */}
        <motion.div
          variants={slideIn("left", "spring", 0.1, 3)}
          initial="hidden"
          animate="show"
          className="restaurants-section"
        >
          <h1 className="section-title">Restaurants</h1>
          <div className="restaurants-list">
            {restaurantData.restaurants?.map((rest) => (
              <motion.div
                key={rest.restaurantId}
                className="restaurant-card"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  console.log("Navigating to /items with restaurantId:", rest.restaurantId);
                  navigate("/items", { state: { restaurantId: rest.restaurantId } });
                }}
              >
                <img
                src={
                  rest.avatar && rest.avatar.startsWith("http")
                    ? rest.avatar
                    : `${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/users/${rest.avatar || "noRestaurant.png"}`} 
                    alt={rest.name}
                  className="restaurant-image"
                />
                <div className="restaurant-info">
                  <h2>{rest.name}</h2>
                  <p>{rest.description}</p>
                  <span className="rating">⭐ {rest.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from "react";
// import "./restaurantHome.scss";
// import RestaurantNavbar from "../../components/restaurantsNavbar/RestaurantsNavbar";
// import CategoriesCarouselMain from "../../components/categoriesCarousel/CategoriesCarouselMain";
// import { motion } from "framer-motion";
// import { fadeIn, slideIn } from "../../utils/motion";
// import { useDispatch, useSelector } from "react-redux";
// import { getRestaurants, resetRestaurantId } from "../../features/userActions/restaurant/restaurantAction"; // Import reset action
// import { useNavigate } from "react-router-dom";

// export default function Homepage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.auth.token);
//   const restaurantData = useSelector((state) => state.restaurant);

//   useEffect(() => {
//     // Fetch restaurants and reset restaurantId when the page loads
//     dispatch(getRestaurants(token));
//     dispatch(resetRestaurantId()); // Reset the restaurantId

//   }, [dispatch, token]);

//   const handleRedirect = (restaurant) => {
//     // Navigate to the 'items' page with the restaurantId
//     console.log("Restaurant ID being passed:", rest.restaurantId);  // Check here

//     navigate("/items", { state: { restaurantId: restaurant.restaurantId } });
//   };

//   return (
//     <div className="homepage">
//       <RestaurantNavbar />
//       <div className="homepage-wrapper">
//         {/* Categories Carousel Section */}
//         <motion.div
//           variants={fadeIn("down", "spring", 0.1, 2)}
//           initial="hidden"
//           animate="show"
//           className="categories-section"
//         >
//           <CategoriesCarouselMain />
//         </motion.div>

//         {/* Restaurants Section */}
//         <motion.div
//           variants={slideIn("left", "spring", 0.1, 3)}
//           initial="hidden"
//           animate="show"
//           className="restaurants-section"
//         >
//           <h1 className="section-title">Restaurants</h1>
//           <div className="restaurants-list">
//           {restaurantData.restaurants?.map((rest) => (
//             <motion.div
//               key={rest.restaurantId}
//               className="restaurant-card"
//               whileHover={{ scale: 1.05 }}
//               onClick={() => {
//                 // Ensure the restaurantId is passed correctly
//                 console.log("Navigating to /items with restaurantId:", rest.restaurantId);
//                 navigate("/items", { state: { restaurantId: rest.restaurantId } });
//               }}
//             >
//                 <img
//                   src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/users/${rest.avatar}`}
//                   alt={rest.name}
//                   className="restaurant-image"
//                 />
//                 <div className="restaurant-info">
//                   <h2>{rest.name}</h2>
//                   <p>{rest.description}</p>
//                   <span className="rating">⭐ {rest.rating}</span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
