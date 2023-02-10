import React, { useState, useEffect, Audio } from "react";
import Link from "next/link";
import HeadComponent from "../components/Head";
import Loading from "../components/Loading";
import styles from "../styles/Store.module.css";
import LoginForm from "../components/MagicWallet/loginForm";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);


  // CONNECTED DISPLAY
  const renderRegisterContainer = () => {
    return (
      <>
        {/* main container */}

        <div className="">
          <div className="signup">
            <div className="signup_container">
              <div className="signup_row1">
                <h1>Sign Up to start selling your products/services.</h1>

                <div className="signup_input_container">
                  <LoginForm />
                </div>
              </div>

              <div className="signup_row2">
                <div className="signup_row2_text">
                  <h4>
                    "Few things make me feel in control than monitoring my
                    business sales on my Dashboard. IkonShop makes my life
                    easier and more efficient."
                  </h4>
                  <div className="name_and_stars">
                    <div>
                      <h5>Aaron Rodney</h5>
                      <p>Founder, ABC Collections</p>
                    </div>
                    <div>
                      <span class="rate">
                        <input type="radio" id="star5" name="rate" />
                        <label for="star5" title="text">
                          5 stars
                        </label>
                        <input type="radio" id="star4" name="rate" />
                        <label for="star4" title="text">
                          4 stars
                        </label>
                        <input type="radio" id="star3" name="rate" />
                        <label for="star3" title="text">
                          3 stars
                        </label>
                        <input type="radio" id="star2" name="rate" />
                        <label for="star2" title="text">
                          2 stars
                        </label>
                        <input type="radio" id="star1" name="rate" />
                        <label for="star1" title="text">
                          1 star
                        </label>
                      </span>
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

  return (
    <div className="App">
      {renderRegisterContainer()}
    </div>
  );
};

export default App;