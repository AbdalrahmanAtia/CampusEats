import React, { useState } from "react";
import "./home.scss";
import MenuSidebar from "../../components/menuSidebar/MenuSidebar";
import Orders from "../../components/orders/Orders";
import AddProducts from "../../components/addProduct/AddProducts";
import UserList from "../../components/userList/UserList";
import ProductList from "../../components/productList/ProductList";
import {logo} from "../../constants/index.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [selectedMenu, setSelectedMenu] = useState(1);

  return (
    <div className="home">
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="App Logo" className="navbar-logo" />
        </Link>      </nav>
      <div className="content">
        <div className="menu">
          <MenuSidebar
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        </div>
        <div className="menu-items">
          {selectedMenu === 1 && <Orders />}
          {selectedMenu === 2 && <AddProducts />}
          {/* {selectedMenu === 3 && <UserList />} */}
          {selectedMenu === 4 && <ProductList />}
        </div>
      </div>
    </div>

  );
}
