import { useState } from "react";
import "./App.css";
import Home from "./pages/home/Home";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
function App() {
  const user = useSelector((state) => state.auth.userData);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user && user.userId ? <Home /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/register"
            element={user && user.userId ? <Navigate to="/login" /> : <Register />}
          />

          <Route
            path="/login"
            element={user && user.userId ? <Navigate to="/" /> : <Login />}
          />

          <Route
            path="/profile"
            element={
              user && user.userId ? <Profile /> : <Navigate to="/login" />
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
