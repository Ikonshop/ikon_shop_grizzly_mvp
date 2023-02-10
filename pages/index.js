import React, { useState, useEffect, Audio } from "react";
import Link from "next/link";
import HeadComponent from "../components/Head";
import Loading from "../components/Loading";
import styles from "../styles/Store.module.css";
import { getStoreTeaser } from "../lib/api";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { LogoTwitter, LogoDiscord } from "react-ionicons";
// MERCHANT COMPONENTS
import Create from "../components/Merchant/Create";
import Orders from "../components/Merchant/Orders";
import Products from "../components/Merchant/Products";
// USER COMPONENTS
import UserOrders from "../components/User/User-Orders";
import CreateLink from "../components/User/Create-Link";
// import Glider from "react-glider";
// import "glider-js/glider.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

// Constants
export const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
export const WEB3STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
var ownerWalletNfts = [];

// Store Codes
const store1 = "IKONS";
const store2 = "MR_SC";
const store3 = "SLABZIO";
const store4 = "FUEGO";
const store5 = "0XDRIP";
const store6 = "PEN_FRENS";
const store7 = "LOGVFX";

const App = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);
  const router = useRouter();
  const { publicKey } = useWallet();
  const [accessGranted, setAccessGranted] = useState(true);
  const [activeWallet, setActiveWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  // MERCHANT DASHBOARD CONSTANTS
  const [showMerchantDash, setShowMerchantDash] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  // USER DASHBOARD CONSTANTS
  const [showUserDash, setShowUserDash] = useState(false);
  const [showUserOrders, setShowUserOrders] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);

  // CONNECTED DISPLAY
  const renderStoreContainer = () => {
    return (
      <>
        {/* main container */}

        <div className="">
          <div className="hero">
            <img
              src="/circle_blue_outline.png"
              className="img1"
              data-aos="fade-right"
            />
            <img src="/green_dot.png" className="img2" />
            <img src="/green_dot.png" className="img4" data-aos="fade-left" />
            <img src="/pink_dot.png" className="img3" />
            <div className="hero_group">
              <h1 data-aos="fade-up">
                Empowering Web3 with the <mark>tools of commerce.</mark>
              </h1>
              <p data-aos="fade-up" data-aos-delay="200">
                IkonShop offers you the benefits of blockchain technology with
                the convenience of familiar online shopping & selling.
              </p>

              <a href="#learn_more">
                <div
                  className="hero_btn"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Learn More
                </div>
              </a>
            </div>
          </div>
          <Container>
            <div className="features2">
              <div className="features_row">
                <h3 className="big_header" data-aos="fade-up">
                  The power of blockchain <mark>technology for everyone.</mark>
                </h3>
                <img src="/iklogo.png" className="ft_logo" />
              </div>
              <div className="features_row vid_row">
                {/* <img
                  className="features_img"
                  src="/iexv.png"
                  data-aos="zoom-out"
                  data-aos-delay="200"
                /> */}
                <video
                  autoPlay
                  loop
                  muted
                  data-aos="zoom-out"
                  data-aos-delay="200"
                >
                  <source src="/ikonshop.mp4" />
                </video>
              </div>
            </div>
          </Container>

          <div className="features">
            <div className="ft_bg"></div>
            <Container>
              <div className="features_container" id="learn_more">
                <div className="features_row">
                  <img
                    className="features_img2"
                    src="/ft1.png"
                    data-aos="zoom-out"
                  />
                </div>

                <div className="features_row">
                  <h2
                    className="big_header"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Premiere Shopping Experience
                  </h2>
                  <p
                    className="features_body"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  >
                    We offer a familiar online shopping experience - browse
                    products, read descriptions, easy & secure checkout,
                    tracking information, order history, and so much more!
                  </p>

                  {/* <div
                    className="features_btn"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    Shop Now
                  </div> */}
                </div>
              </div>
            </Container>
          </div>

          <div className="why_section">
            <div className="ft_bigred" data-aos="fade-down-right"></div>
            <div className="ft_outlineblue" data-aos="fade-left"></div>
            <Container>
              <div className="why_ikonshop">
                <h2 className="why_header">
                  <mark>How IkonShop Works</mark>
                </h2>
                <div className="why_content">
                  <div className="why_card_row">
                    <div className="why_content_card" data-aos="fade-up">
                      <div className="why_img_head">
                        <img src="/search.png" />
                      </div>
                      <div>
                        <p>Search and Discover</p>
                        {/* <p>
                          Search for your favorite products or browse to
                          discover new favorites! You'll find everything from
                          IRL products to digital goods & services.
                        </p> */}
                      </div>
                    </div>
                    <div
                      className="why_content_card"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      <div className="why_img_head">
                        <img src="/desc.png" />
                      </div>
                      <div>
                        <p>Browse and Choose</p>
                        {/* <p>
                          Click on a product/service to view details and a
                          description on what you'll be receiving.
                        </p> */}
                      </div>
                    </div>

                    <div
                      className="why_content_card"
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      <div className="why_img_head">
                        <img src="/cart.png" />
                      </div>
                      <div>
                        <p>Multi-Store Cart</p>
                        {/* <p>
                          Add the product to your cart. Continue shopping or
                          View Your Cart to complete your order.
                        </p> */}
                      </div>
                    </div>
                    <div
                      className="why_content_card"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      <div className="why_img_head">
                        <img src="/check.png" />
                      </div>
                      <div>
                        <p>Wallet Based Payments</p>
                        {/* <p>
                          Go to the Checkout to easily & securely connect your
                          wallet & input your shipping information. Pay directly
                          with your wallet.
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <div className="compatible">
            <div className="comp_smallred"></div>
            <div className="comp_outlineblue"></div>
            <Container>
              <h2 data-aos="fade-up">
                IkonShop is compatible with your favorite tools.
              </h2>
              <p data-aos="fade-up" data-aos-delay="200">
                Seamlessly integrate your Web2 e-commerce plugins.
              </p>
            </Container>
            <div className="compatible_cards">
              <div
                className="comp_card"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <img src="/shipstation.png" />
              </div>
              <div
                className="comp_card"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <img src="/shopify.png" />
              </div>
            </div>
          </div>

          <div className="features features_ft2">
            <div className="ft_bg"></div>
            <Container>
              <div className="features_container">
                <div className="features_row">
                  <h2 className="big_header">
                    Start your Web3 business today!
                  </h2>
                  <p className="features_body">
                    The future of commerce is here. Join IkonShop and take
                    control of your business and the way you earn money.
                  </p>

                  <a href="https://forms.gle/Hufp94teN3h1QdAw5">
                    <div className="features_btn">Get Started</div>
                  </a>
                </div>
                <div className="features_row">
                  <img className="features_img2" src="/ft2.png" />
                </div>
              </div>
            </Container>
          </div>
        </div>
      </>
    );
  };

  // MERCHANT DASHBOARD
  const renderMerchantDashboard = () => {
    return (
      <>
        <div className="merchant-dashboard">
          <button
            className="close-button"
            onClick={() => setShowMerchantDash(false)}
          >
            X
          </button>
          <button className="dash-button" onClick={() => setShowCreate(true)}>
            Create a Product
          </button>
          <button className="dash-button" onClick={() => setShowOrders(true)}>
            Show Orders
          </button>
          <button
            className="dash-button"
            onClick={() => setShowInventory(true)}
          >
            Show Inventory
          </button>
        </div>
      </>
    );
  };

  const renderCreateComponent = () => {
    return (
      <>
        <div className="create-component">
          <button className="close-button" onClick={() => setShowCreate(false)}>
            X
          </button>
          <Create />
        </div>
      </>
    );
  };

  const renderOrdersComponent = () => {
    return (
      <>
        <div className="merchant-component">
          <button className="close-button" onClick={() => setShowOrders(false)}>
            X
          </button>
          <Orders />
        </div>
      </>
    );
  };

  const renderInventoryComponent = () => {
    return (
      <>
        <div className="merchant-component">
          <button
            className="close-button"
            onClick={() => setShowInventory(false)}
          >
            X
          </button>
          <Products />
        </div>
      </>
    );
  };

  // USER DASHBOARD
  const renderUserDashboard = () => {
    return (
      <>
        <div className="merchant-dashboard">
          <button
            className="close-button"
            onClick={() => setShowUserDash(false)}
          >
            X
          </button>
          <button
            className="dash-button"
            onClick={() => setShowUserOrders(true)}
          >
            Show Orders
          </button>
          <button
            className="dash-button"
            onClick={() => setShowCreateLink(true)}
          >
            Create Pay Link
          </button>
        </div>
      </>
    );
  };

  const renderUserOrdersComponent = () => {
    return (
      <>
        <div className="merchant-component">
          <button
            className="close-button"
            onClick={() => setShowUserOrders(false)}
          >
            X
          </button>
          <UserOrders />
        </div>
      </>
    );
  };

  const renderCreateLinkComponent = () => {
    return (
      <>
        <div className="create-component">
          <button
            className="close-button"
            onClick={() => setShowCreateLink(false)}
          >
            X
          </button>
          <CreateLink />
        </div>
      </>
    );
  };

  return (
    <div className="App">
      <HeadComponent />
      {/* <div className="container"> */}
      <main>
        {!loading && !showCreate && !showCreateLink
          ? renderStoreContainer()
          : null}

        {loading ? <Loading /> : null}
        {showMerchantDash && !showCreate && !showOrders && !showInventory
          ? renderMerchantDashboard()
          : null}
        {showCreate && renderCreateComponent()}
        {showOrders && renderOrdersComponent()}
        {showInventory && renderInventoryComponent()}
        {showUserDash && !showUserOrders && !showCreateLink
          ? renderUserDashboard()
          : null}
        {showUserOrders && renderUserOrdersComponent()}
        {showCreateLink && renderCreateLinkComponent()}
      </main>
      {/* </div> */}
    </div>
  );
};

export default App;
