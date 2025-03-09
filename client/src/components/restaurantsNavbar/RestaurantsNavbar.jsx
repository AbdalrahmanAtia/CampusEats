// File: src/components/restaurants_navbar/RestaurantNavbar.jsx
import React, { useContext, useRef, useState } from "react";
import "./restaurantsNavbar.scss";
import {
  IoSearchSharp,
  profilePic,
  logo,
  menuLinks,
  BsBoxArrowInLeft,
} from "../../constants/index";
import OutsideClickHandler from "react-outside-click-handler";
import { motion } from "framer-motion";
import { menuVars } from "../../utils/motion";
import context from "../../context/context";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authAction";
import { getSearchedRestaurants } from "../../features/userActions/restaurant/restaurantAction";

export default function RestaurantNavbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const inputRef = useRef();
  const timeoutRef = useRef(null);

  const user = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearchedRestaurants = () => {
    const fetchSearchResults = () => {
      dispatch(getSearchedRestaurants(token, inputRef.current.value));
    };

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (inputRef.current.value) {
        fetchSearchResults();
      }
    }, 500);
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="mid">
        <div className="search-inp">
          <input
            type="text"
            placeholder="Search for restaurants..."
            ref={inputRef}
            onChange={handleSearchedRestaurants}
          />
          <IoSearchSharp className="icon" onClick={handleSearchedRestaurants} />
        </div>
      </div>
      <div className="right">
        <OutsideClickHandler onOutsideClick={() => setToggleMenu(false)}>
          <div
            className={`menu-div ${toggleMenu ? "ham-open" : ""}`}
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            <div className="ham-line" />
            {toggleMenu && (
              <motion.div
                variants={menuVars}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`menu-tray ${!toggleMenu ? "hide-tray" : ""}`}
              >
                <img
                  src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/users/${user.avatar}`}
                  alt="user avatar"
                />
                <p>{user.username}</p>
                <ul>
                  {menuLinks.map((link) => (
                    <Link className="Link" to={link.link} key={link.id}>
                      <motion.li>
                        <link.icon className="icon" /> {link.id}
                      </motion.li>
                    </Link>
                  ))}
                  <li onClick={handleLogout}>
                    <BsBoxArrowInLeft className="icon" /> Logout
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </OutsideClickHandler>
      </div>
    </div>
  );
}
