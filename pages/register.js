import React, { useState, useEffect, Audio } from "react";
import Link from "next/link";
import HeadComponent from "../components/Head";
import Loading from "../components/Loading";
import styles from "../styles/Store.module.css";
import LoginForm from "../components/MagicWallet/loginForm";
import Register from "../components/Register/Register";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();

  // CONNECTED DISPLAY
  const renderRegisterContainer = () => {
    const [userName, setUserName] = useState(null);
    const [storeName, setStoreName] = useState(null);
    const [email, setEmail] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [loading, setLoading] = useState(false);


    const renderForm = () => {
      return (
        <>
          <form onSubmit={() => setShowRegister(true)}>
            <div className="register_options">
              <p>How would you like to proceed?</p>
              <div>
                <button
                  className="signup_button user_btn"
                  onClick={() => router.push("/register/user")}
                >
                  Register as User
                </button>
                <button
                  className="signup_button_sec"
                  onClick={() => router.push("/register/merchant")}
                >
                  Register as Merchant
                </button>
              </div>

              {/* <p className="guide_p_register">
                Not sure? <span>Refer to this guide</span>
              </p> */}
            </div>
          </form>
        </>
      );
    };

    const renderRegisterPage = () => {
      return (
        <>
          {!showRegister && (
            <>
              <Register userName={userName} storeName={storeName} email={email} />

              <button
                className="signup_button"
                onClick={() => {
                  setShowRegister(false);
                }}
              >
                Edit Info
              </button>
            </>
          )}
        </>
      );
    };

    return (
      <>
        {/* main container */}

        <div className="">
          <div className="signup2">
            <div className="signup_container2">
              <h1>Hello, anon.</h1>
      
              {!showRegister && renderForm()}
              {showRegister && renderRegisterPage()}
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
