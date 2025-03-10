import React, { useRef, useState } from "react";
import "./login.scss";
import {
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  logo,
  FaEye,
  FaEyeSlash,
} from "../../constants/index.js";
// import Carousel from "../../components/carousel/Carousel.jsx";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "../../components/carousel/Carousel.jsx";
import { useEffect } from "react";
import { clearError } from "../../features/auth/authSlice.js";

import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../features/auth/authAction.js";
export default function Login() {
  const [hidePass, setHidePass] = useState(true);
  const emailRef = useRef();
  const passRef = useRef();
  const dispatch = useDispatch();
  const auth = useSelector((select) => select.auth);
  
  useEffect(() => {
    return () => {
      dispatch(clearError()); // Clears error when navigating away
    };
  }, []);


  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Dispatch signUp action with additional fields
      const response = await dispatch(signIn(emailRef.current.value, passRef.current.value, "restaurant"));
  
      // Handle the backend response
      if (response.message) {
        alert(response.message);
      }

    } catch (error) {
      //alert(error.message || "Registration failed. Please try again.");
    }  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="reg-wrap-left">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <h1>Restaurant Login</h1>
          {auth.error && <p className="error-message">{auth.error}</p>}
          <form onSubmit={handleSignIn} className="login-form">
            <label htmlFor="username">Email</label>
            <input type="email" placeholder="Enter Email" ref={emailRef} />

            <label htmlFor="password">Password</label>
            <div className="pass-div">
              <input
                type={`${hidePass ? "password" : "text"}`}
                placeholder="Enter you password"
                ref={passRef}
              />
              {hidePass ? (
                <FaEyeSlash
                  className="icon"
                  onClick={() => setHidePass(!hidePass)}
                />
              ) : (
                <FaEye
                  className="icon"
                  onClick={() => setHidePass(!hidePass)}
                />
              )}
            </div>
            <button type="submit" className="button">
              Sign In
            </button>
            <div className="left-bottom">
                  <p>or</p>
                  <p>
                    Don't have an account?{" "}
                    <Link to={"/register"}>
                      <span>Sign Up</span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            <div className="reg-wrap-right">
              <Carousel images={[backgroundImg1, backgroundImg2, backgroundImg3, backgroundImg4]} />
            </div>
          </div>
        </div>
  );
}
