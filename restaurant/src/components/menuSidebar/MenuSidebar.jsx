import { useDispatch, useSelector } from "react-redux";
import {
  BiAddToQueue,
  FaRegRectangleList,
  GrContactInfo,
  PiArchiveBox,
  profilePic,
  logo,
} from "../../constants/index";


import "./menuSidebar.scss";
import React from "react";
import { logout } from "../../features/auth/authAction";
import { Link } from "react-router-dom";


export default function MenuSidebar({ selectedMenu, setSelectedMenu }) {

  const user = useSelector((select) => select.auth.userData);

  console.log(selectedMenu);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="menu-sidebar">
      <div className="img-div">
        <Link to="/profile">
          <img 
          src={`${import.meta.env.VITE_API_BASE_IMAGE_URI}/assets/images/users/${user.avatar}`}
          alt="" />
        </Link>
      </div>
      <ul className="menu-options">
        <li
          className={`${selectedMenu === 1 ? "li-active" : ""}`}
          onClick={() => setSelectedMenu(1)}
        >
          <PiArchiveBox className="icon" />
        </li>
        <li
          className={`${selectedMenu === 2 ? "li-active" : ""}`}
          onClick={() => setSelectedMenu(2)}
        >
          <BiAddToQueue className="icon" />
        </li>
        {/* <li
          className={`${selectedMenu === 3 ? "li-active" : ""}`}
          onClick={() => setSelectedMenu(3)}
        >
          <GrContactInfo className="icon" />
        </li> */}
        <li
          className={`${selectedMenu === 4 ? "li-active" : ""}`}
          onClick={() => setSelectedMenu(4)}
        >
          <FaRegRectangleList className="icon" />
        </li>
      </ul>
      <div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  );
}
