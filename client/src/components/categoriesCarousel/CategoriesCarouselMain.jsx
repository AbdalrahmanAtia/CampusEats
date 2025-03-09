import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./categoriesCarousel.scss";
import { Pagination, Navigation, HashNavigation } from "swiper/modules";
import CategoryItemCardMain from "../categoryItemsCard/CategoryItemCardMain";
import { useDispatch, useSelector } from "react-redux";
import { getMainCategories } from "../../features/userActions/category/categoryAction";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  // Fetch categories on mount
  useEffect(() => {
    dispatch(getMainCategories(token));
  }, [dispatch, token]);

  const category = useSelector((state) => state.category);
  const [activeSlide, setActiveSlide] = useState(null);

  // Update activeSlide when categories are fetched
  useEffect(() => {
    if (category.categories?.length) {
      const defaultCategory = category.categories.find(
        (item) => item.categoryName === "View All"
      );
      if (defaultCategory) {
        setActiveSlide(defaultCategory.categoryId);
      } else {
        // If "View All" is not found, set the first category as default
        setActiveSlide(category.categories[0].categoryId);
      }
    }
  }, [category.categories]);

  return (
    <Swiper
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 24 },
        480: { slidesPerView: 2, spaceBetween: 24 },
        640: { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 2, spaceBetween: 32, slidesPerGroup: 1 },
        1336: { slidesPerView: 4, spaceBetween: 32 },
      }}
      hashNavigation={{ watchState: true }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation, HashNavigation]}
      className="swiper2"
    >
      {category.categories?.map((item, index) => (
        <SwiperSlide key={index} className="swiper-slide">
          <CategoryItemCardMain
            key={item.categoryId}
            id={index}
            imgSrc={item.categoryImage}
            itemName={item.categoryName}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
            categoryId={item.categoryId}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
