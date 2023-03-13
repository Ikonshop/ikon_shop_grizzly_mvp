import React, { useState, useEffect, Audio, useRef } from "react";
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
import { IoPlayCircle } from "react-icons/io5";
import AccordionItem from "../components/FAQ";

// Constants
export const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
export const WEB3STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;

const App = (props) => {
  const keywords = ["Tips", "Pay Links", "Products", "Life"];
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

  const [active, setActive] = useState(null);
  const [activeWord, setActiveWord] = useState(keywords[0]);

  const faqs = [
    {
      id: 1,
      header: "What is Lorem Ipsum?",
      text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
    },
    {
      id: 2,
      header: "Where does it come from?",
      text: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. `,
    },
    {
      id: 3,
      header: "Why do we use it?",
      text: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature,`,
    },
    {
      id: 4,
      header: "Where can I get some?",
      text: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
    },
  ];

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  // CONNECTED DISPLAY
  const renderStoreContainer = () => {
    return (
      <>
        {/* main container */}

        <div className="">
          <section className="info_section">
            <div className="container_main3">
              <h1>
                Create, Receive, and Manage :{" "}
                <span className="active_span">{activeWord}</span>
                <br />
                on <span className="sol_span">Solana</span>
              </h1>
              <p className="info_body3">
                IkonShop brings the benefits of blockchain technology to your
                online consumer experience.
              </p>

              <br />
              <br />
              <button
                className="signup_button"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Get Started
              </button>
            </div>
            <div className="container_info_img hero_img">
              <img src="/hero.png" alt="" />
            </div>
          </section>

          {/* <Container>
            <div className="hero_social_proof">
              <p className="trusted_text">Trusted by your favorites:</p>
              <div className="social_imgs">
                <img src="/pen.png" />
                <img src="/slabz.png" />
                <img src="/abc.png" />
              </div>
            </div>
          </Container> */}

          <section className="info_section section2">
            <div className="container_info_img">
              <img src="/img1.png" alt="" />
            </div>
            <div className="container_main">
              <p className="info_small_header">Merchant</p>
              <h1>
                Create a Storefront, create physical/digital products and sell.
              </h1>
              <p className="info_body2">
                Merchants can create storefronts, physical/digital products,
                manage their orders, products, and many more securely on
                IkonShop.
              </p>

              <br />
              <br />
              <button
                className="signup_button"
                onClick={() => {
                  router.push("/register/merchant");
                }}
              >
                Get Started
              </button>
            </div>
          </section>

          <section className="info_section">
            <div className="container_main2">
              <p className="info_small_header">Consumer</p>
              <h1>
                Receive payments, tipjars, and get useful insights on your
                dashboard.
              </h1>
              <p className="info_body">
                For everyday users, degens etc IkonShop serves as a useful and
                insightful tool to manage you web3 finance
              </p>

              <br />
              <br />
              <div className="buttons">
                <a href="https://rapisurv.com">
                  <button
                    className="signup_button"
                    onClick={() => {
                      router.push("/register/user");
                    }}
                  >
                    Get Started
                  </button>
                </a>
                <button className="signup_button secondary_btn">
                  <IoPlayCircle
                    style={{
                      fontSize: "24px",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "15px",
                    }}
                  >
                    Learn how
                  </p>
                </button>
              </div>
            </div>
            <div className="container_info_img">
              <img src="/img2.png" alt="" />
            </div>
          </section>

          <section className="faqs">
            <Container>
              <p className="faqs_small_header">Frequently asked questions</p>
              <h2>Questions you might have</h2>
              {faqs.map((faq, index) => {
                return (
                  <AccordionItem
                    key={index}
                    active={active}
                    handleToggle={handleToggle}
                    faq={faq}
                  />
                );
              })}
            </Container>
          </section>

          {/* <div className="features">
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
                  </p> */}

          {/* <div
                    className="features_btn"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    Shop Now
                  </div> */}
          {/* </div>
              </div>
            </Container>
          </div> */}

          {/* <div className="why_section">
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
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div> */}

          {/* <div className="compatible">
            <div className="comp_smallred"></div>
            <div className="comp_outlineblue"></div>
            <Container>
              <img src="/compatible_icon.png" />
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
          </div> */}

          {/* <div className="features features_ft2">
          
            <Container>
              <div className="features_container">
                <div class="avatars">
                  <a href="#" class="avatars__item">
                    <img class="avatar" src="/ik1.png" alt="" />
                  </a>
                  <a href="#" class="avatars__item">
                    <img class="avatar" src="/ik2.png" alt="" />
                  </a>
                  <a href="#" class="avatars__item">
                    <img class="avatar" src="/ik3.png" alt="" />
                  </a>
                  <a href="#" class="avatars__item">
                    <img class="avatar" src="/ik4.png" alt="" />
                  </a>
                  <a href="#" class="avatars__item">
                    <img class="avatar" src="/ik5.png" alt="" />
                  </a>
                </div>
                <h2 className="big_header">
                  Join innovative merchants & consumers who use IkonShop
                  everyday.
                </h2>

                <a href="#">
                  <div className="features_btn">Get Started</div>
                </a>
              </div>
            </Container>
          </div> */}
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

  useEffect(() => {
    // every 1s, rotate the set the activeWord to the next word in the keyword array
    // if the activeWord is the last word in the array, set it to the first word
    const interval = setInterval(() => {
      setActiveWord((activeWord) =>
        activeWord === keywords[keywords.length - 1]
          ? keywords[0]
          : keywords[keywords.indexOf(activeWord) + 1]
      );
    }, 1200);
    return () => clearInterval(interval);
  }, [activeWord]);

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
