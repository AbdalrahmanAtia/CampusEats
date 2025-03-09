import React, { useRef, useState, useEffect } from "react";
import "./register.scss";
import {
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  logo,
  FaEye,
  FaEyeSlash,
} from "../../constants/index.js";
import Carousel from "../../components/carousel/Carousel.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../features/auth/authAction.js";
import { getAllCategories} from "../../features/category/categoryAction.js";

export default function RegisterRestaurant() {
  const [hidePass, setHidePass] = useState(true);
  const auth = useSelector((select) => select.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const phoneNumberRef = useRef();
  const nameRef = useRef();
  const locationRef = useRef();
  const universityRef = useRef();
  const ratingRef = useRef();
  const descriptionRef = useRef();


  // useEffect(() => {
  //   dispatch(getAllCategories());
  // }, []);

  // const category = useSelector((state) => state.category);
  // console.log("categoryyyyyyyyyyyyyyyy: " + category)
  // useEffect(() => {
  //   console.log("Categories:", category.categories); // Debugging
  // }, [category.categories]);


  const handleRegister = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const name = nameRef.current.value;
    const location = locationRef.current.value;
    const university = universityRef.current.value;
    const rating = ratingRef.current.value;
    const description = descriptionRef.current.value;

    try {
      const response = await dispatch(
        signUp(
          username,
          email,
          password,
          phoneNumber,
          name,
          location,
          university,
          rating,
          description,
        )
      );
      if (response.message) {
        alert(response.message);
      }
      //navigate("/login");
    } catch (error) {
      //alert(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register">
      <div className="register-wrapper">
        <div className="reg-wrap-left">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <h1>Restaurant Registration</h1>
          <form onSubmit={handleRegister} className="register-form">
            <p className="error-message">{auth.error && auth.error}</p>
            <label>Username</label>
            <input type="text" placeholder="Enter username" ref={usernameRef} required />

            <label>Email</label>
            <input type="email" placeholder="Enter Email" ref={emailRef} required />

            <label>Password</label>
            <div className="pass-div">
              <input type={hidePass ? "password" : "text"} placeholder="Enter password" ref={passRef} required />
              {hidePass ? (
                <FaEyeSlash className="icon" onClick={() => setHidePass(!hidePass)} />
              ) : (
                <FaEye className="icon" onClick={() => setHidePass(!hidePass)} />
              )}
            </div>

            <label>Phone Number</label>
            <input type="tel" placeholder="Enter phone number" ref={phoneNumberRef} required />

            <label>Restaurant Name</label>
            <input type="text" placeholder="Enter restaurant name" ref={nameRef} required />

            {/* <label>Category</label>


            { <select ref={categoryIdRef} required>
              <option value="">Select a category</option>
              {category.length > 0 ? (
                category.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))
              ) : (
                <option value="">Loading categories...</option>
              )}
            </select> } */}

            <label>Location</label>
            <input type="text" placeholder="Enter location" ref={locationRef} required />

            <label>University</label>
            <input type="text" placeholder="Enter university" ref={universityRef} required />

            <label>Rating on Google Maps</label>
              <input 
                type="number" 
                placeholder="Enter rating (out of 5)" 
                ref={ratingRef} 
                required 
                min="1" 
                max="5" 
                step="0.1" 
              />
            <label>Description</label>
            <textarea placeholder="Enter description" ref={descriptionRef} required />

            <button type="submit" className="button">Sign Up</button>

            <div className="left-bottom">
              <p>or</p>
              <p>
                Already have an account? <Link to={"/login"}><span>Sign In</span></Link>
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
