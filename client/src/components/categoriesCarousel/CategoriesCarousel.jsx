
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./categoriesCarousel.scss";
import { Pagination, Navigation, HashNavigation } from "swiper/modules";
import CategoryItemCard from "../categoryItemsCard/CategoryItemCard";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesByRestaurant } from "../../features/userActions/category/categoryAction";
import { useLocation } from "react-router-dom";

export default function App({ onCategorySelect }) {
  const [activeSlide, setActiveSlide] = useState(1);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  const restaurantId = location.state?.restaurantId;

  useEffect(() => {
    if (restaurantId) {
      dispatch(getCategoriesByRestaurant(token, restaurantId));
    }
  }, [restaurantId, dispatch, token]);  // Add restaurantId as a dependency

  const category = useSelector((state) => state.category);

  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 24,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 32,
          slidesPerGroup: 1,
        },
        1336: {
          slidesPerView: 4,
          spaceBetween: 32,
        },
      }}
      hashNavigation={{
        watchState: true,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation, HashNavigation]}
      className="swiper2"
    >
      {category.categories &&
        category.categories?.map((item, index) => (
          <SwiperSlide key={index} className="swiper-slide">
          <CategoryItemCard
            key={item.categoryId}
            id={index}
            imgSrc={item.categoryImage}
            itemName={item.categoryName}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            categoryId={item.categoryId}
            onCategorySelect={onCategorySelect}
            restaurantId={restaurantId}  // Pass restaurantId here
          />
            
          </SwiperSlide>
        ))}
    </Swiper>
  );
}


// import React, { useEffect, useRef, useState } from "react";
// // Import Swiper React components
// import { Swiper, SwiperSlide } from "swiper/react";
// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import "./categoriesCarousel.scss";

// // import required modules
// import { Pagination, Navigation, HashNavigation } from "swiper/modules";
// import CategoryItemCard from "../categoryItemsCard/CategoryItemCard";
// import { useDispatch, useSelector } from "react-redux";
// import { getCategoriesByRestaurant, getCategory } from "../../features/userActions/category/categoryAction";
// import { useLocation } from "react-router-dom";

// export default function App() {
//   const [activeSlide, setActiveSlide] = useState(1);
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const location = useLocation();

//   const restaurantId = location.state?.restaurantId;

//   // fetch the categories when component mounted
//   useEffect(() => {
//     dispatch(getCategoriesByRestaurant(token, restaurantId));
//   }, []);

//   const category = useSelector((state) => state.category);
//   useEffect(() => {
//     console.log("Categories:", category.categories); // Debugging
//   }, [category.categories]);

//   return (
//     <Swiper
//       breakpoints={{
//         // when window width is >= 320px
//         320: {
//           slidesPerView: 1,
//           spaceBetween: 24,
//         },
//         // when window width is >= 480px
//         480: {
//           slidesPerView: 2,
//           spaceBetween: 24,
//         },
//         // when window width is >= 640px
//         640: {
//           slidesPerView: 2,
//           spaceBetween: 24,
//         },
//         1024: {
//           slidesPerView: 2,
//           spaceBetween: 32,
//           slidesPerGroup: 1,
//         },
//         1336: {
//           slidesPerView: 4,
//           spaceBetween: 32,
//         },
//         // 1600: {
//         //   slidesPerView: 8,
//         //   spaceBetween: 38,
//         // },
//       }}
//       // spaceBetween={55}
//       hashNavigation={{
//         watchState: true,
//       }}
//       pagination={{
//         clickable: true,
//       }}
//       navigation={true}
//       modules={[Pagination, Navigation, HashNavigation]}
//       className="swiper2"
//     >
//       {category.categories &&
//         category.categories?.map((item, index) => (
//           <SwiperSlide key={index} className="swiper-slide">
//             <CategoryItemCard
//               key={item.categoryId}
//               id={index}
//               imgSrc={item.categoryImage}
//               itemName={item.categoryName}
//               activeSlide={activeSlide}
//               setActiveSlide={setActiveSlide}
//               categoryId={item.categoryId}
//             />
//           </SwiperSlide>
//         ))}
//     </Swiper>
//   );
// }
