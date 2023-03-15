import React, { useState, useEffect, Audio, useRef } from "react";
import Link from "next/link";
import HeadComponent from "../components/Head";
import Loading from "../components/Loading";
import styles from "../styles/Store.module.css";
import { GetGlassWindowDisplay } from "../lib/api";
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
import Glider from "react-glider";
// import "glider-js/glider.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {
  IoCheckmarkCircle,
  IoPerson,
  IoPlayCircle,
  IoStorefront,
} from "react-icons/io5";
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
  const [loading, setLoading] = useState(true);
  const [glassDisplay, setGlassDisplay] = useState([]);
  const [glassDisplaySelected, setGlassDisplaySelected] = useState([]);
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
      header: "What is a Web3 ecommerce platform?",
      text: `A Web3 ecommerce platform is a decentralized, blockchain-based marketplace that leverages smart contracts and cryptocurrency for secure and transparent transactions between buyers and sellers. It combines the benefits of blockchain technology with traditional ecommerce features to create a more equitable and user-driven online shopping experience.`,
    },
    {
      id: 2,
      header: "How does a Web3 ecommerce platform work?",
      text: `A Web3 ecommerce platform connects buyers and sellers directly, without intermediaries. It utilizes blockchain technology and smart contracts to manage transactions, ensuring secure and transparent processing. Buyers use cryptocurrency to purchase products, while sellers receive payments in the form of digital assets.`,
    },
    {
      id: 3,
      header: " What are the benefits of using a Web3 ecommerce platform?",
      text: "Some benefits of using IkonShop include:  ➊ Decentralization: Elimination of middlemen reduces fees and potential for fraud.  ➋ Security: Blockchain technology ensures secure and transparent transactions.  ➌ Ownership: Users have full control over their data and digital assets.  ➍ Incentives: Tokenized rewards systems can encourage user engagement and loyalty.  ➎ Global accessibility: Anyone with an internet connection and a digital wallet can participate.",
    },
    // {
    //   id: 4,
    //   header: "What cryptocurrencies are supported on the platform?",
    //   text: `Supported cryptocurrencies are stablecoin USD Coin (USDC) and SOL. A seller may also implement other forms SPL tokens to accept in their store.`,
    // },
    {
      id: 4,
      header: "How do I create an account on IkonShop?",
      text: `To create an account, you will need a digital wallet compatible. For now they are: Phantom, OTHER Wallets.... Once installed, follow the platform's onboarding process, which typically involves connecting your wallet and approving any necessary transactions.`,
    },
    // {
    //   id: 6,
    //   header: "How do I buy and sell products on the platform?",
    //   text: `To buy products, browse the platform's listings, select an item, and complete the checkout process using your digital wallet. To sell products, create a new merchant account. Your digital wallet will be connected to manage transactions and receive payments.`,
    // },
    // {
    //   id: 7,
    //   header: "How are disputes resolved?",
    //   text: `Dispute resolution methods may vary depending on the type of Tx. IkonShop implements a decentralized dispute resolution systems and a merit based system. We analyze sellers and their sellers metrics.`,
    // },
    // {
    //   id: 4,
    //   header: "Are there fees associated with using a IkonShop?",
    //   text: `Fees may include transaction costs (such as gas fees for Solana). These fees are usually lower than those on traditional ecommerce platforms, as there are no intermediaries.`,
    // },
    // {
    //   id: 9,
    //   header: "How does the platform handle refunds and returns?",
    //   text: `Refund and return policies vary depending on the seller. Before making a purchase, review the seller's return policy and any specific guidelines.`,
    // },
    // {
    //   id: 5,
    //   header: "Is my personal information safe on IkonShop?",
    //   text: `IkonShop is built with user privacy in mind. By design, they minimize the amount of personal information required and give users full control over their data. However, we suggest you review our privacy policy and take necessary precautions, such as using a secure digital wallet and keeping your private keys safe.`,
    // },
  ];

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  const handleRotateGlassDisplay = () => {
    // the current glassDisplaySelected is the first item in the glassDisplay array
    // every second we want to rotate the glassDisplaySelected to the next item in the array
    // if the current glassDisplaySelected is the last item in the array, then we want to rotate the glassDisplaySelected to the first item in the array

    // get the index of the current glassDisplaySelected
    const currentIndex = glassDisplay.indexOf(glassDisplaySelected[0]);

    // if the current glassDisplaySelected is the last item in the array
    if (currentIndex === glassDisplay.length - 1) {
      // set the glassDisplaySelected to the first item in the array
      setGlassDisplaySelected([glassDisplay[0]]);
    } else {
      // set the glassDisplaySelected to the next item in the array
      setGlassDisplaySelected([glassDisplay[currentIndex + 1]]);
    }
  };

  const renderGlassDisplay = () => {
    // console.log("glassDisplay", glassDisplay);
    // glassDisplay is an array of objects (each object is a store)
    // each store object has a projectName, banner
    // return a carousel of store banners with the projectName displayed under each banner
    console.log("glassDisplaySelected", glassDisplaySelected);
    return (
      <div className="glass_display">
        <Glider
          hasArrows
          hasDots
          slidesToShow={1}
          slidesToScroll={1}
          draggable
          scrollLock
          dots=".dots"
          arrows={{
            prev: ".glider-prev",
            next: ".glider-next",
          }}
        >
          <div className="glass_display_stats">
            <div>
              <div className="info_small_header_featured">
                <IoStorefront />
                <span>Stores</span>
              </div>
              <h3 className="glass_display_stats_header">Featured Stores</h3>
              {/* <p>Your favorite projects are on the Ikonshop</p> */}
            </div>

            <div className="glass_display_item">
              <div className="glass_display_item_inner">
                <img src={glassDisplaySelected[0].pfp} alt="" />
                <div className="glass_display_item_inner_overlay"></div>
                <div className="glass_display_item_inner_text">
                  <h3>{glassDisplaySelected[0].projectName}</h3>
                  <p>Products: {glassDisplaySelected[0].products.length}</p>
                  {glassDisplaySelected[0].verified ? (
                    <div>
                      <IoCheckmarkCircle />
                      <span>Verified collection</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* <div className="glass_display_item_details">
              <p>Products: {glassDisplaySelected[0].products.length}</p>
            </div> */}
          </div>
        </Glider>
      </div>
    );
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
              <div className="info_small_header">
                <IoStorefront />
                <span>Merchant</span>
              </div>
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
          {renderGlassDisplay()}

          <section className="info_section">
            <div className="container_main2">
              <div className="info_small_header2">
                <IoPerson />
                <span>Consumer</span>
              </div>
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
                <button
                  className="signup_button"
                  onClick={() => {
                    router.push("/register/user");
                  }}
                >
                  Get Started
                </button>

                {/* <button className="signup_button secondary_btn">
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
                </button> */}
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

  useEffect(() => {
    //every 1s handleRotateGlassWindow
    const interval = setInterval(() => {
      handleRotateGlassDisplay();
    }, 4000);
    return () => clearInterval(interval);
  }, [glassDisplaySelected]);

  useEffect(() => {
    async function getGlassWindowDisplay() {
      const data = await GetGlassWindowDisplay();
      console.log("data", data);

      setGlassDisplay(data);
      setGlassDisplaySelected(data);
      setLoading(false);
    }
    getGlassWindowDisplay();
  }, []);

  return (
    <div className="App">
      <HeadComponent />
      {/* <div className="container"> */}
      <main>
        {!loading ? renderStoreContainer() : null}
        {loading ? <Loading /> : null}
      </main>
      {/* </div> */}
    </div>
  );
};

export default App;
