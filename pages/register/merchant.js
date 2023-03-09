import React, { useState, useEffect, Audio } from "react";
import Link from "next/link";
import HeadComponent from "../../components/Head";
import Loading from "../../components/Loading";
import styles from "../../styles/Store.module.css";
import LoginForm from "../../components/MagicWallet/loginForm";
import Register from "../../components/Register/RegisterMerchant";
import { useWallet } from "@solana/wallet-adapter-react";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const { publicKey, connected, disconnect } = useWallet();

  // CONNECTED DISPLAY
  const renderRegisterContainer = () => {
    const [userName, setUserName] = useState(null);
    const [storeName, setStoreName] = useState(null);
    const [email, setEmail] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "name") {
        setUserName(value);
      } else if (name === "storeName") {
        setStoreName(value);
      } else if (name === "email") {
        setEmail(value);
      }
    };

    const renderForm = () => {
      return (
        <>
          <h1 className="signup_header_h1">
            Sign Up to start selling your products/services.
          </h1>
          <form onSubmit={() => setShowRegister(true)}>
            {/* EMAIL */}
            <input
              type="email"
              onChange={handleChange}
              name="email"
              required="required"
              placeholder="Enter your email"
            />
            {/* NAME */}
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required="required"
              placeholder="Enter your name"
            />
            {/* STORE NAME */}
            <input
              type="text"
              name="storeName"
              onChange={handleChange}
              placeholder="Enter your store name (optional)"
            />
            <br />
            <div>
              <a href="/terms">
                <p>
                  By signing up, you agree to IkonShop's{" "}
                  <strong>Terms of Use</strong> and{" "}
                  <strong>Privacy Policy</strong>
                </p>
              </a>
              <button type="submit" className="signup_button">
                Proceed
              </button>
            </div>
          </form>
        </>
      );
    };

    const renderRegisterPage = () => {
      return (
        <>
          <Register userName={userName} storeName={storeName} email={email} />

          {/* <button
            className="signup_button"
            onClick={() => {
              setShowRegister(false);
            }}
          >
            Edit Info
          </button> */}
        </>
      );
    };

    return (
      <>
        {/* main container */}

        <div className="">
          <div className="signup">
            <div className="signup_container">
              <div className="signup_row1">
                <div
                  className="signup_input_container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {!showRegister && renderForm()}
                  {showRegister && renderRegisterPage()}
                </div>
              </div>
              <div className="signup_row2">
                <div className="signup_row2_text">
                  <h4>
                    "Our goal is to provide users a seamless transition to 
                    shopping online using blockchain technology, allowing them to
                    leverage our tools to grow their business or handle day-to-day tasks."
                  </h4>
                  <div className="name_and_stars">
                    <div>
                      <h5>Mike Kruz</h5>
                      <p>Founder, IkonShop</p>
                    </div>
                    
                  </div>
                </div>
                <img src="/signup.png" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (publicKey) {
      // disconnect the wallet upon mount
      disconnect();
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return <div className="App">{renderRegisterContainer()}</div>;
};

export default App;
