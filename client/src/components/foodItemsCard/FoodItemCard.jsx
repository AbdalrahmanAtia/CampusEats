import React, { useEffect, useState } from "react";
import "./foodItemCard.scss";
import {
  mealsImage,
  IoMdStar,
  GoDotFill,
  LiaPoundSignSolid,
  FaCirclePlus,
  GoDash,
  GoPlus,
} from "../../constants";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToCart,
  decrementItem,
  incrementItem,
} from "../../features/userActions/cart/cartAction";

export default function FoodItemCard({ item }) {
  // state for checking whether an item is added to the cart or not
  const [isAddedTocart, setIsAddedTocart] = useState(false);
  const [itemQuantity, setItemQuantity] = useState(0);
  const [error, setError] = useState(""); // state to handle errors

  const dispatch = useDispatch();

  // cart state
  const cartItems = useSelector((state) => state.cart).cartItems;

  useEffect(() => {
    getCurrentQuantity(); // get current item quantity
  }, [cartItems]);

  // handle adding items to cart
  const handleAddItem = () => {
    const isSameRestaurant = cartItems.every(
      (cartItem) => cartItem.restaurantId === item.restaurantId
    );

    if (isSameRestaurant || cartItems.length === 0) {
      dispatch(addItemToCart(item)); // add current item to cart
      setIsAddedTocart(true);
      setError(""); // clear error if item is successfully added
    } else {
      setError("You can only add items from the same restaurant to the cart.");
    }
  };

  // get current quantity of the item
  const getCurrentQuantity = () => {
    const matchedItem = cartItems?.find(
      (cartItem) => cartItem.productId === item.productId
    );
    setItemQuantity(matchedItem?.quantity);
  };

  const handleItemIncrement = () => {
    dispatch(incrementItem(item)); // increment item
  };

  const handleItemDecrement = () => {
    dispatch(decrementItem(item)); // decrement item
  };

  return (
    <div className="foodItemCard">
      <div className="img-div">
        <img
          src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${
            item.image
          }`}
          alt=""
          loading="lazy"
        />
      </div>
      <div className="item-description">
        <h2>{item.productName}</h2>
        <p>{item.description} </p>
        <div className="item-rating">
          <span>
            {item.rating}
            <IoMdStar className="icon star" />{" "}
          </span>
          <span>
            <GoDotFill className="icon veg" />
            veg
          </span>
        </div>
        <div className="item-cost">
          <span>
            <LiaPoundSignSolid className="icon rupee" /> {item.price}
          </span>
          <div className="add-to-cart">
            {!itemQuantity ? (
              <FaCirclePlus className="icon" onClick={handleAddItem} />
            ) : (
              <div className="item-count">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  onClick={handleItemDecrement}
                >
                  <GoDash className="icon-btn minus" />
                </motion.div>
                <span>{itemQuantity}</span>
                <motion.div
                  whileTap={{ scale: 0.75 }}
                  onClick={handleItemIncrement}
                >
                  <GoPlus className="icon-btn plus" />
                </motion.div>
              </div>
            )}
          </div>
          {error && <div className="error-message">{error}</div>} {/* Display error */}
        </div>
      </div>
    </div>
  );
}
