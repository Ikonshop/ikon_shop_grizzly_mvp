import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@solana/wallet-adapter-react";
import Orders from "../../components/User/Link-Orders";
import styles from "../../styles/Merchant.module.css";
import Loading from "../../components/Loading";
import * as web3 from "@solana/web3.js";
import {
  faLink,
  faJar,
} from "@fortawesome/free-solid-svg-icons";
// USER COMPONENTS
import UserOrders from "../../components/User/User-Orders";
import PayRequests from "../../components/Merchant/PayRequests";
import CreateLink from "../../components/User/Create-Link";
import {
  getCollectionOwner,
  deleteSingleProduct,
} from "../../lib/api";
import {
  IoArrowBackOutline,
  IoBarChartOutline,
  IoDocumentOutline,
  IoFileTrayFullOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
  IoCopy,
  IoEye,
  IoTrashBin,
  IoLockClosedOutline
} from "react-icons/io5";
// import ElusivDash from "../../components/Elusiv/dash";
// import ElusivSetup from "../../components/Elusiv/userSetUp";
// import RecentTxns from "../../components/Elusiv/recentTxns";

config.autoAddCss = false;

function Dashboard() {
  const [loading, setLoading] = useState(null);
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [currentWallet, setCurrentWallet] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const router = useRouter();
  const { publicKey, connected } = useWallet();

  // USER DASHBOARD CONSTANTS
  const [showUserDash, setShowUserDash] = useState(true);
  const [showUserOrders, setShowUserOrders] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [showLinkOrders, setShowLinkOrders] = useState(false);
  // const [showElusivSetup, setShowElusivSetup] = useState(false);
  const [userLinks, setUserLinks] = useState([]);
  const [userTipJar, setUserTipJar] = useState([]);

  const renderLoading = () => <Loading />;

  // USER DASHBOARD
  const renderUserDashboard = () => {
    return (
      <>
        <div className={styles.merchant_dashboard}>
          <button
            id="overview"
            disabled={!publicKey && !userPublicKey}
            className={
              activeMenu == "overview"
                ? "active_dash dash-button"
                : "dash-button"
            }
            onClick={() => (
              setShowCreateLink(false),
              setShowUserOrders(false),
              setShowLinkOrders(false),
              setActiveMenu("overview")
            )}
          >
            <IoBarChartOutline />

            <span id={styles.full_screen}>Overview</span>
          </button>
          <button
            id="order"
            disabled={!publicKey && !userPublicKey}
            className={
              activeMenu == "order" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowCreateLink(false),
              setShowLinkOrders(false),
              setShowUserOrders(true),
              setActiveMenu("order")
            )}
          >
            <IoFileTrayFullOutline />
            <span id={styles.full_screen}>Txn History</span>
          </button>
          <button
            id="payreq"
            disabled={!publicKey && !userPublicKey}
            className={
              activeMenu == "payreq" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowLinkOrders(false),
              setShowCreateLink(true),
              setActiveMenu("payreq")
            )}
          >
            <IoLinkOutline style={{ transform: "rotate(-45deg)" }} />

            <span id={styles.full_screen}>Pay Hub</span>
          </button>
          {/* <button
            id="elusiv"
            disabled={!publicKey}
            className={
              activeMenu == "elusiv" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowLinkOrders(false),
              setShowCreateLink(false),
              setActiveMenu("elusiv")
            )}
          >
            <IoLockClosedOutline />

            <span id={styles.full_screen}>Elusiv History</span>
          </button> */}
          <button
            id="link"
            disabled={!publicKey && !userPublicKey}
            className={
              activeMenu == "link" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowCreateLink(false),
              setShowLinkOrders(true),
              setActiveMenu("link")
            )}
          >
            <IoDocumentOutline />
            <span id={styles.full_screen}>My Orders</span>
          </button>
          <button className="dash-button" onClick={() => router.push("/")}>
            <IoArrowBackOutline />
            <span id={styles.full_screen}>Back to Stores</span>
          </button>
        </div>
      </>
    );
  };

  const renderUserOrdersComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <UserOrders />
        </div>
      </>
    );
  };

  const renderOrdersComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <Orders />
        </div>
      </>
    );
  };

  const renderCreateLinkComponent = () => {
    return (
      <>
        <div className="create-component">
          <CreateLink />
        </div>
      </>
    );
  };

  // const renderElusivSetupComponent = () => {
  //   return (
  //     <>
  //       <div className="create-component">
  //         <ElusivDash />
  //         <RecentTxns />
  //       </div>
  //     </>
  //   );
  // };

  const renderDisplay = () => (
    <div className={styles.merchant_containter}>
      <div className={styles.banner_hero}>
        <div className={styles.hero_text}>
          <h1>
            Hello Wallet:{" "}
            <span>
              {currentWallet.slice(0, 4)}...
              {currentWallet.slice(-4)}{" "}
            </span>
          </h1>
          <button
            onClick={() => setShowCreateLink(true)}
            id={styles.full_screen}
            className="hero-button"
          >
            Start Selling
          </button>
        </div>
        <div className={styles.hero_overlay}></div>
      </div>
      {/* <ElusivDash publicKey={publicKey} /> */}
      <div className={styles.recent_links_container}>
        {/* NO USER LINKS CREATED */}
        {userLinks.length > 0 && !loading ? (
          renderProductLinks()
        ) : (
          <h4 className={styles.paylink_header}>Pay Requests</h4>
        )}
        {userTipJar.length > 0 && !loading ? (
          renderTipJar()
        ) : (
          <h4 className={styles.paylink_header}>Tip Jars</h4>
        )}
      </div>
    </div>
  );

  const renderProductLinks = () => {
    return (
      <div>
        <h4 className={styles.paylink_header}>Pay Requests</h4>
        <div className={styles.links_container}>
          {userLinks.slice(0, 3).map((payRequest, index) => (
            <div className={styles.link} key={index}>
              <div className={styles.payreq_col1}>
                <div className={styles.payreq_bg}>
                  <IoLinkOutline
                    style={{
                      transform: "rotate(-45deg)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                    className={styles.link_icon}
                    icon={faLink}
                  />
                </div>
                <div className={styles.link_name}>
                  {payRequest.name.length > 15
                    ? payRequest.name.substring(0, 15) + "..."
                    : payRequest.name}
                </div>
              </div>
              <div className={styles.icon_container}>
                <IoCopy
                  className={styles.link_icon}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://ikonshop.io/product/${payRequest.id}`
                    )
                  }
                />
                <IoEye
                  className={styles.link_icon}
                  onClick={() => router.push(`/product/${payRequest.id}`)}
                />
                <IoTrashBin
                  className={styles.link_icon}
                  onClick={() => {
                    deleteSingleProduct(payRequest.id),
                    setUserLinks(userLinks.filter((_, i) => i !== index));
                  }}
                />
              </div>
          </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTipJar = () => {
    return (
      <div>
        <h4 className={styles.paylink_header}>Tip Jars</h4>
        <div className={styles.paylink_container}>
          {userTipJar.slice(0, 2).map((tipJarLink, index) => (
            <div className={styles.link} key={index}>
              <div className={styles.payreq_col1}>
                <div className={styles.tipjar_bg}>
                  <FontAwesomeIcon
                    style={{
                      color: "#fff",
                    }}
                    className={styles.link_icon}
                    icon={faJar}
                  />
                </div>
                <div className={styles.link_name}>
                  {tipJarLink.name.length > 15
                    ? tipJarLink.name.substring(0, 15) + "..."
                    : tipJarLink.name}
                </div>
              </div>
              <div className={styles.icon_container}>
                <IoCopy
                  className={styles.link_icon}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://ikonshop.io/product/${tipJarLink.id}`
                    )
                  }
                />
                <IoEye
                  className={styles.link_icon}
                  onClick={() => router.push(`/product/${tipJarLink.id}`)}
                />
                <IoTrashBin
                  className={styles.link_icon}
                  onClick={() => {
                    deleteSingleProduct(tipJarLink.id),
                    setUserTipJar(userTipJar.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConnectWallet = () => {
    return (
      <>
        <div>
          <div className={styles.connect_wallet}>
            <IoInformationCircleOutline className={styles.info_icon} />
            <div className={styles.connect_wallet_text}>
              <h4>Wallet not connected</h4>
              <p>Connect Your Wallet to Get Started</p>
            </div>
          </div>
        </div>
      </>
    );
  };
  const getAllProducts = async () => {
    const owner = publicKey.toString();
    // remove any current data in userLinks, userTipJar, and ownerProducts to avoid duplicates
    const clearLinks = () => {
      setUserLinks([]);
      setUserTipJar([]);
      setOwnerProducts([]);
    };
    await clearLinks();
    // get all products from the store
    const products = await getCollectionOwner(owner);
    // filter products into userLinks, userTipJar, and ownerProducts
    for (let i = 0; i < products.products.length; i++) {
      if (products.products[i].type === "link") {
        for (let j = 0; j < userLinks.length; j++) {
          if (userLinks[j].id != products.products[i].id) {
            setUserLinks((userLinks) => [...userLinks, products.products[i]]);
          }
        }
      }
      if (products.products[i].type === "tipjar") {
        for (let k = 0; k < userTipJar.length; k++) {
          if (userTipJar[k].id != products.products[i].id) {
            setUserTipJar((userTipJar) => [
              ...userTipJar,
              products.products[i],
            ]);
          }
        }
      }
      if (
        products.products[i].type === "product" &&
        !ownerProducts.includes(products.products[i].id)
      ) {
        setOwnerProducts((ownerProducts) => [
          ...ownerProducts,
          products.products[i].id,
        ]);
      }
      if (i === products.products.length - 1) {
        // console.log("userLinks", userLinks);
        // console.log("userTipJar", userTipJar);
        // console.log("ownerProducts", ownerProducts);
        setLoading(false);
      }
    }
  };

  const refreshLinks = () => {
    return (
      <button
        className={styles.refresh_button}
        onClick={() => {
          setLoading(true);
          getAllProducts();
        }}
      >
        Refresh
      </button>
    );
  };

  useEffect(() => {
    if (publicKey) {
      // checkOwnership();
      setCurrentWallet(publicKey.toString());
      const owner = publicKey.toString();
      const getAllProducts = async () => {
        const products = await getCollectionOwner(owner);
        for (let i = 0; i < products.products.length; i++) {
          if (products.products[i].type === "link") {
            userLinks.push(products.products[i]);
          }
          if (products.products[i].type === "tipjar") {
            userTipJar.push(products.products[i]);
          }
          if (products.products[i].type === "product") {
            ownerProducts.push(products.products[i]);
          }
          if (i === products.products.length - 1) {
            setLoading(false);
          }
        }
      };
      getAllProducts();
    }
    if(!publicKey && userPublicKey){
      setCurrentWallet(userPublicKey)
      const owner = userPublicKey;
      const getAllProducts = async () => {
          const products = await getCollectionOwner(owner);
          for (let i = 0; i < products.products.length; i++) {
            if (products.products[i].type === "link") {
              userLinks.push(products.products[i]);
            }
            if (products.products[i].type === "tipjar") {
              userTipJar.push(products.products[i]);
            }
            if (products.products[i].type === "product") {
              ownerProducts.push(products.products[i]);
            }
            if (i === products.products.length - 1) {
              setLoading(false);
            }
          }
        };
        getAllProducts();
    }
  }, [publicKey, userPublicKey]);


  useEffect(() => {
    //if the url ends in ?payhub=true, show the payhub
    if (window.location.href.includes("?payhub=true")) {
      setShowCreateLink(true),
      setActiveMenu("payreq")
    }
  }, []);

  useEffect(() => {
    if(publicKey) {
      setUserPublicKey(publicKey.toString())
    }
    if(window){
      //check local storage for userMagicMetadata and set it to state
      if(localStorage.getItem('userMagicMetadata')){
        const publicAddress = JSON.parse(localStorage.getItem('userMagicMetadata')).publicAddress
        const publicKey = new web3.PublicKey(publicAddress);
        setUserPublicKey(publicKey.toString())
        console.log('public key from local storage', publicKey.toString())
      }
    }
  }, [publicKey, userPublicKey])

  return (
    <div className={styles.parent_container}>
      {showUserDash ? renderUserDashboard() : null}
      <div className={styles.main_container}>
        {!userPublicKey ? renderConnectWallet() : null}

        {userPublicKey != null && loading ? renderLoading() : null}
        
        {!loading && userPublicKey != null && !showUserOrders && !showCreateLink && !showLinkOrders 
          ? renderDisplay()
          : null}
        {/* {publicKey && refreshLinks()} */}
        
        
        {userPublicKey != null && showUserOrders && renderUserOrdersComponent()}
        
        {userPublicKey != null && showCreateLink && renderCreateLinkComponent()}
        
        {userPublicKey != null && showLinkOrders && renderOrdersComponent()}
        {/* {publicKey && showElusivSetup && renderElusivSetupComponent()} */}
        
      </div>
    </div>
  );
}
export default Dashboard;
