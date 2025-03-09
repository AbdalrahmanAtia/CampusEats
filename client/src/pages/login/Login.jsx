import React, { useRef, useState, useEffect } from "react";
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
import Carousel from "../../components/carousel/Carousel.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../features/auth/authAction.js";
import {clearError} from "../../features/auth/authSlice.js";
import qs from "qs";
import axios from "axios";
//import { UserModel } from "../../../../api/models/user.model.js"; // Import your UserModel

export default function Login() {
  const [hidePass, setHidePass] = useState(true);
  const emailRef = useRef();
  const passRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added for navigation
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
      const response = await dispatch(signIn(emailRef.current.value, passRef.current.value, "student"));
  
      // Handle the backend response
      if (response.message) {
        alert(response.message);
      }

  
    } catch (error) {
      //alert(error.message || "Registration failed. Please try again.");
    }
  };

  // Added: Handle Outlook sign-in
// Updated handleOutlookSignIn function
const handleOutlookSignIn = async () => {
  try {
    console.log("Redirecting to Microsoft login page...");
    console.log("Microsoft login URL:", `${import.meta.env.VITE_API_BASE_URI}/users/microsoft`);
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URI}/users/microsoft`);
    const data = await response.json();
    console.log("Microsoft login response:", data);
    window.location.href = data.url;
  } catch (error) {
    console.error("Error during Outlook sign-in:", error);
  }
};

useEffect(() => {
  if (window.location.pathname !== "/login") return; // Ensure it's only executed on the login page

  const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      try {
        console.log("Microsoft OAuth Code Received:", code);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URI}/users/microsoft/callback?code=${code}`
        );
        const profile = await response.json();

        if (profile.email) {
          dispatch(clearError()); // Clears error when navigating away
          navigate("/register", { state: { email: profile.email } });
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    }
  };

  handleCallback();
}, [navigate]);


  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="reg-wrap-left">
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <h1>Login</h1>
          <form onSubmit={handleSignIn} className="login-form">
            {/* Added: Outlook Sign-In Button */}
            <button
              type="button"
              className="outlook-button"
              onClick={handleOutlookSignIn}
            >
              <img
                src="https://img.icons8.com/color/48/000000/microsoft-outlook-2019--v1.png"
                alt="Outlook Logo"
              />
              Sign up with Outlook
            </button>

            <div className="or-divider">
              <span>or</span>
            </div>
            {auth.error && <p className="error-message">{auth.error}</p>}

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

            {/* <div className="left-bottom">
              <p>or</p>
              <p>
                Dont't have an account?{" "}
                <Link to={"/register"}>
                  <span>Sign Up</span>
                </Link>
              </p>
            </div> */}
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
// import "./login.scss";
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
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { signIn } from "../../features/auth/authAction.js";
// import qs from "qs";
// import axios from "axios";

// const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
// const MICROSOFT_CLIENT_SECRET = import.meta.env.VITE_MICROSOFT_CLIENT_SECRET;
// const MICROSOFT_TENANT_ID = import.meta.env.VITE_MICROSOFT_TENANT_ID;
// const MICROSOFT_REDIRECT_URI = import.meta.env.VITE_MICROSOFT_REDIRECT_URI;

// // Step 1: Redirect user to Microsoft login page
// const getMicrosoftLoginUrl = () => {
//   const params = {
//     client_id: MICROSOFT_CLIENT_ID,
//     response_type: "code",
//     redirect_uri: MICROSOFT_REDIRECT_URI,
//     response_mode: "query",
//     scope: "openid profile email User.Read",
//     state: "12345", // Optional: Add a state parameter for security
//   };

//   console.log(
//     "Microsoft login URL:",
//     `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?${qs.stringify(params)}`
//   );

//   return `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?${qs.stringify(params)}`;
// };

// // Step 2: Handle Microsoft callback and get access token
// const handleMicrosoftCallback = async (code, navigate) => {
//   try {
//     console.log("Microsoft code:", code);
//     const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
//     const params = {
//       client_id: MICROSOFT_CLIENT_ID,
//       client_secret: MICROSOFT_CLIENT_SECRET,
//       code,
//       redirect_uri: MICROSOFT_REDIRECT_URI,
//       grant_type: "authorization_code",
//     };

//     const response = await axios.post(tokenUrl, qs.stringify(params), {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     console.log("Microsoft token response:", response.data);

//     const { access_token } = response.data;
//     const userProfile = await getMicrosoftProfile(access_token);

//     console.log("Verified email:", userProfile.email);
//     console.log("University domain:", userProfile.domain);
//     localStorage.setItem("userEmail", userProfile.email);
//     navigate("/register");
    
//     // Redirect to the registration page with the verified email
//     navigate("/register", { state: { email: userProfile.email } });
//   } catch (error) {
//     console.error("Error during Microsoft callback:", error);
//   }
// };

// // Step 3: Get user profile from Microsoft Graph API
// const getMicrosoftProfile = async (accessToken) => {
//   try {
//     const profileUrl = "https://graph.microsoft.com/v1.0/me";
//     console.log("Fetching Microsoft profile...");
//     const response = await axios.get(profileUrl, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     console.log("Microsoft profile response:", response.data);


//     const { mail, userPrincipalName } = response.data;
//     const email = mail || userPrincipalName; // Ensure we get the email

//     if (!email) throw new Error("Email not found in Microsoft profile");

//     return {
//       email,
//       domain: email.split("@")[1],
//     };
//   } catch (error) {
//     console.error("Error fetching Microsoft profile:", error);
//     throw error;
//   }
// };

// export default function Login() {
//   const [hidePass, setHidePass] = useState(true);
//   const emailRef = useRef();
//   const passRef = useRef();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [code, setCode] = useState('');

//   const handleSignIn = (e) => {
//     e.preventDefault();
//     console.log("Signing in...");
//     console.log("Email:", emailRef.current.value);
//     dispatch(signIn(emailRef.current.value, passRef.current.value));
//   };

//   // Handle Outlook sign-in
//   const handleOutlookSignIn = async () => {
//     try {
//       const loginUrl = getMicrosoftLoginUrl();
//       console.log("Microsoft login URL:", loginUrl);
//       console.log("Redirecting to Microsoft login page...");
//       window.location.href = loginUrl;
//       console.log("window.location.href:", window.location.href);
//     } catch (error) {
//       console.error("Error during Outlook sign-in:", error);
//     }
//   };

//   const handleOutlookLogin = () => {
//     const loginUrl = UserModel.getMicrosoftLoginUrl();
//     window.location.href = loginUrl;
//   };

//   return (
//     <div className="login">
//       <div className="login-wrapper">
//         <div className="reg-wrap-left">
//           <div className="logo">
//             <img src={logo} alt="" />
//           </div>
//           <h1>Login</h1>
//           <form onSubmit={handleSignIn} className="login-form">
//             <button
//               type="button"
//               className="outlook-button"
//               onClick={handleOutlookSignIn}
//             >
//               <img
//                 src="https://img.icons8.com/color/48/000000/microsoft-outlook-2019--v1.png"
//                 alt="Outlook Logo"
//               />
//               Sign in with Outlook
//             </button>

//             <div className="or-divider">
//               <span>or</span>
//             </div>

//             <label htmlFor="username">Email</label>
//             <input type="email" placeholder=" Enter your Email" ref={emailRef} />

//             <label htmlFor="password">Password</label>
//             <div className="pass-div">
//               <input
//                 type={`${hidePass ? "password" : "text"}`}
//                 placeholder="Enter your password"
//                 ref={passRef}
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
//             <button type="submit" className="button">
//               Sign In
//             </button>

//             <div className="left-bottom">
//               <p>or</p>
//               <p>
//                 Dont't have an account?{" "}
//                 <Link to={"/register"}>
//                   <span>Sign Up</span>
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