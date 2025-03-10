import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import "./orders.scss";
import {
  IoIosArrowDown,
  IoIosArrowUp,
  LiaPoundSignSolid,
  RiHomeFill,
  mealsImage,
} from "../../constants";
import DropDown from "../../components/dropDown/DropDown";
import { motion, useAnimate } from "framer-motion";
import { slideIn } from "../../utils/motion";
import { Link } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../features/userActions/order/orderAction.js";
// import { getOrderHistory } from "../../features/userActions/order/orderAction";

const OrderItemInfo = ({ item }) => {
  return (
    <div className="order-item-info">
      <div className="item-img-name">
        {" "}
        <img
          src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/${
            item.image
          }`}
          alt={item.productName}
          loading="lazy"
        />
        <p>{item.productName}</p>
      </div>
      <p>x{item.quantity}</p>
      <p>
        <LiaPoundSignSolid /> {item.price}
      </p>
    </div>
  );
};

const OrderItem = ({ order }) => {
  const [dropOrderItemInfo, setDropOrderItemInfo] = useState(false);
  return (
    <div className="order-item">
      <OutsideClickHandler onOutsideClick={() => setDropOrderItemInfo(false)}>
        <div
          className="order-info"
          onClick={() => setDropOrderItemInfo(!dropOrderItemInfo)}
        >
          <p>
            <span>Order no:</span> {order.orderNumber}
          </p>

          <p>
            <span>Status:</span> {order.orderStatus}
          </p>

          <p className="date">
            {/* <span>Date:</span> 14.01.2024 */}
            <span>Date:</span> {order.pickUpTime}
          </p>
          <p>
            <span>Total:</span>
            <LiaPoundSignSolid />
            {order.total}
          </p>
          {dropOrderItemInfo ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: dropOrderItemInfo ? "auto" : 0,
            opacity: dropOrderItemInfo ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="order-items"
        >
          {order.items?.map((item, index) => (
            <OrderItemInfo key={index} item={item} />
          ))}
        </motion.div>
      </OutsideClickHandler>
    </div>
  );
};

export default function Orders() {
  const [selectedValue, setSelectedValue] = useState("All");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const orderHistory = useSelector((state) => state.order.orderHistory); // Get orders from Redux state

  useEffect(() => {
    dispatch(getOrderHistory(token));
  }, [dispatch, token]);

  // Filter orders based on selectedValue
  const filteredOrders = selectedValue === "All" 
    ? orderHistory 
    : orderHistory?.filter(order => order.orderStatus.toLowerCase() === selectedValue.toLowerCase());

  return (
    <div className="orders">
      <Navbar />
      <Link to={"/"}>
        <RiHomeFill className="home-icon" />
      </Link>
      <div className="orders-wrapper">
        <motion.div
          variants={slideIn("up", "spring", 0.2, 2)}
          initial="hidden"
          animate="show"
          className="orders-head"
        >
          <h1>My Orders</h1>
          <div className="selector">
            <DropDown
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              items={["All", "placed", "Delivered", "cancelled"]}
            />
          </div>
        </motion.div>
        <div className="order-summary">
          {filteredOrders?.length > 0 ? (
            filteredOrders.map((order, index) => (
              <OrderItem key={index} order={order} />
            ))
          ) : (
            <p className="no-orders">No orders found!</p>
            // <p className="no-orders">No orders found for "{selectedValue}"</p>

          )}
        </div>
      </div>
    </div>
  );
}
