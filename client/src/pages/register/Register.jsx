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
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useLocation and useNavigate
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../features/auth/authAction.js";

export default function Register() {
  const [hidePass, setHidePass] = useState(true);
  const auth = useSelector((select) => select.auth);
  const dispatch = useDispatch();
  const location = useLocation(); // Access state passed from login page
  const navigate = useNavigate(); // Navigation hook

  // Refs for form inputs
  const usernameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const phoneNumberRef = useRef();
  const studentIdRef = useRef();
  const universityRef = useRef();

  // Extract student ID and university from email
  useEffect(() => {
    if (location.state?.email) {
      const email = location.state.email;
      emailRef.current.value = email;

      const emailParts = email.split("@");
      if (emailParts.length === 2) {
        const studentId = emailParts[0]; // Extract part before "@"
        studentIdRef.current.value = studentId; // Auto-fill student ID

        const domain = emailParts[1];
        if (domain.includes(".cu.")) {
          const university = "Cairo University";; // Extract university name
          universityRef.current.value = university; // Auto-fill university
        } else {
          const university = "Unknown University";  
          universityRef.current.value = university; // Auto-fill university
        }
      }
    }
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Get values from refs
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const studentId = studentIdRef.current.value;
    const university = universityRef.current.value;
  
    // Validate email contains ".edu."
    if (!email.includes(".edu.")) {
      alert("Error: Please use a university email containing '.edu.'");
      navigate("/login");
    }
  
    try {
      // Dispatch signUp action with additional fields
      const response = await dispatch(signUp(username, email, password, phoneNumber, studentId, university));
  
      // Handle the backend response
      if (response.message) {
        alert(response.message);
      }
  
      // Redirect to login after successful registration
      navigate("/login");
  
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
          <h1>Register</h1>
          <form onSubmit={handleRegister} className="register-form">
            <p className="error-message">{auth.error && auth.error}</p>

            <label htmlFor="username">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              ref={usernameRef}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              ref={emailRef}
              readOnly={!!location.state?.email} // Make email read-only if pre-filled
              required
            />

            <label htmlFor="password">Password</label>
            <div className="pass-div">
              <input
                type={`${hidePass ? "password" : "text"}`}
                placeholder="Enter your password"
                ref={passRef}
                required
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

            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              ref={phoneNumberRef}
              required
            />

            <label htmlFor="university">University</label>
              <input
                type="text"
                placeholder="University"
                ref={universityRef}
                required
                readOnly // Auto-filled and read-only
              />
            <label htmlFor="studentId">Student ID</label>
              <input
                type="text"
                placeholder="Enter student ID"
                ref={studentIdRef}
                required
                readOnly // Auto-filled and read-only
              />
            <button type="submit" className="button">
              Sign Up
            </button>

            <div className="left-bottom">
              <p>or</p>
              <p>
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span>Sign In</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="reg-wrap-right">
          <Carousel
            images={[
              backgroundImg1,
              backgroundImg2,
              backgroundImg3,
              backgroundImg4,
            ]}
          />
        </div>
      </div>
    </div>
  );
}





// import React, { useRef, useState, useEffect } from "react";
// import "./register.scss";
// import {
//   backgroundImg1,
//   backgroundImg2,
//   backgroundImg3,
//   backgroundImg4,
//   logo,
//   FaEye,
//   FaEyeSlash,
// } from "../../constants/index.js";
// import Carousel from "../../components/carousel/Carousel.jsx";
// import { Link, useLocation } from "react-router-dom"; // Added useLocation
// import { useDispatch, useSelector } from "react-redux";
// import { signUp } from "../../features/auth/authAction.js";

// export default function Register() {
//   const [hidePass, setHidePass] = useState(true);
//   const auth = useSelector((select) => select.auth);
//   const dispatch = useDispatch();
//   const location = useLocation(); // Added to access state passed from login page

//   console.log("Location State:", location.state);
//   console.log("Extracted email:", location.state?.email); // Debugging

//   // Refs for form inputs
//   const usernameRef = useRef();
//   const emailRef = useRef();
//   const passRef = useRef();
//   const phoneNumberRef = useRef();
//   const studentIdRef = useRef();

//   // Pre-fill email if redirected from Outlook sign-in
//   const [email, setEmail] = useState(location.state?.email || "");

//   useEffect(() => {
//     console.log("Location state updated:", location.state); // Debugging
//     if (location.state?.email) {
//       console.log("Setting email from location.state:", location.state.email); // Debugging
//       setEmail(location.state.email);
//     }
//   }, [location.state]);

//   const handleRegister = (e) => {
//     e.preventDefault();

//     // Get values from refs
//     const username = usernameRef.current.value;
//     const email = emailRef.current.value;
//     const password = passRef.current.value;
//     const phoneNumber = phoneNumberRef.current.value;
//     const studentId = studentIdRef.current.value;

//     // Dispatch signUp action with additional fields
//     dispatch(
//       signUp({
//         username,
//         email,
//         password,
//         phoneNumber,
//         studentId,
//       })
//     );
//   };

//   return (
//     <div className="register">
//       <div className="register-wrapper">
//         <div className="reg-wrap-left">
//           <div className="logo">
//             <img src={logo} alt="" />
//           </div>
//           <h1>Register</h1>
//           <form onSubmit={handleRegister} className="register-form">
//             <p className="error-message">{auth.error && auth.error}</p>

//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               placeholder="Enter username"
//               ref={usernameRef}
//               required
//             />

//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               readOnly={!!email} // Make the field read-only if email is pre-filled
//               required
//             />

//             <label htmlFor="password">Password</label>
//             <div className="pass-div">
//               <input
//                 type={`${hidePass ? "password" : "text"}`}
//                 placeholder="Enter your password"
//                 ref={passRef}
//                 required
//               />
//               {hidePass ? (
//                 <FaEyeSlash
//                   className="icon"
//                   onClick={() => setHidePass(!hidePass)}
//                 />
//               ) : (
//                 <FaEye
//                   className="icon"
//                   onClick={() => setHidePass(!hidePass)}
//                 />
//               )}
//             </div>

//             <label htmlFor="phoneNumber">Phone Number</label>
//             <input
//               type="tel"
//               placeholder="Enter phone number"
//               ref={phoneNumberRef}
//               required
//             />

//             <label htmlFor="studentId">Student ID</label>
//             <input
//               type="text"
//               placeholder="Enter student ID"
//               ref={studentIdRef}
//               required
//             />

//             <button type="submit" className="button">
//               Sign Up
//             </button>

//             <div className="left-bottom">
//               <p>or</p>
//               <p>
//                 Already have an account?{" "}
//                 <Link to={"/login"}>
//                   <span>Sign In</span>
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//         <div className="reg-wrap-right">
//           <Carousel
//             images={[
//               backgroundImg1,
//               backgroundImg2,
//               backgroundImg3,
//               backgroundImg4,
//             ]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }