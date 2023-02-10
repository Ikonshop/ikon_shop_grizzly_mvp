import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
// import { getCollectionOrders } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Orders from "../../components/User/Link-Orders";
import styles from "../../styles/Merchant.module.css";
import Loading from "../../components/Loading";
import {
  WarningOutline,
  TrashBin,
  Link,
  Gift,
  Clipboard,
} from "react-ionicons";
// USER COMPONENTS
import UserOrders from "../../components/User/User-Orders";
import PayRequests from "../../components/Merchant/PayRequests";
import CreateLink from "../../components/User/Create-Link";
import { getCollectionOwner } from "../../lib/api";
import {
  IoArrowBackOutline,
  IoBarChartOutline,
  IoDocumentOutline,
  IoFileTrayFullOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
} from "react-icons/io5";

config.autoAddCss = false;

function CurrentLinks() {
  const [loading, setLoading] = useState(null);
  const [currentWallet, setCurrentWallet] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [userLinks, setUserLinks] = useState([]);
  const [userTipJar, setUserTipJar] = useState([]);
  const [betaUser, setBetaUser] = useState(true);
  const [showGreen, setShowGreen] = useState(false);

  const renderLoading = () => <Loading />;

  // USER DASHBOARD
  const renderUserDashboard = () => {
    return (
      <>
        <div className={styles.merchant_dashboard}>
          <button
            id="overview"
            disabled={!publicKey}
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
            disabled={!publicKey}
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
            <span id={styles.full_screen}>Order History</span>
          </button>
          <button
            id="payreq"
            disabled={!publicKey}
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

            <span id={styles.full_screen}>Create Pay Request</span>
          </button>
          <button
            id="link"
            disabled={!publicKey}
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
            <span id={styles.full_screen}>View Link Orders</span>
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

  const renderDisplay = () => (
    <div className={styles.dashboard_container}>
      {userLinks.length > 0 && !loading ? (
      <PayRequests publicKey={publicKey}/>
      ) : (
        null
      )}
    </div>
  );

  const renderProductLinks = () => {
    return (
      <div>
        <h4 className={styles.paylink_header}>Pay Requests</h4>
        <div className={styles.paylink_container}>
          {userLinks.map((product, index) => (
            <div key={index} className={styles.links}>
              <Link
                style={{
                  color: "#000",
                  fontSize: "12px",
                  marginLeft: "2px",
                  marginTop: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/product/${product.id}`)}
              />
              <button
                className={styles.link_button}
                onClick={() => {
                  router.push(`/product/${product.id}`);
                }}
              >
                ikonshop.io/product/{product.id}
              </button>
              <TrashBin
                style={{
                  color: "#000",
                  fontSize: "12px",
                  marginLeft: "2px",
                  marginTop: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this link?") ==
                    true
                  ) {
                    deleteSingleProduct(product.id),
                      // delete product from userLinks using it's index position
                      setUserLinks(userLinks.filter((_, i) => i !== index));
                  } else {
                    return;
                  }
                }}
              />

              {/* <Clipboard
                className={styles.copy_icon}
                icon={faCopy}
                style={{
                  color: "#000",
                  fontSize: "24px",
                  marginLeft: "6px",
                  marginTop: "-2px",
                  cursor: "pointer",
                  borderLeft: "1px solid #bebebe",
                  paddingLeft: "10px",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(`https://ikonshop.io/product/${product.id}`),
                  setShowGreen(true),
                  console.log("should trigger green");
                }
                }
              /> */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTipJar = () => {
    return (
      <div>
        <h4 className={styles.paylink_header} style={{ marginTop: "30px" }}>
          TipJar
        </h4>
        <div className={styles.paylink_container}>
          {userTipJar.map((product, index) => (
            <div key={index} className={styles.links}>
              <Gift
                style={{
                  color: "#000",
                  fontSize: "24px",
                  marginLeft: "2px",
                  marginTop: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/product/${product.id}`)}
              />
              <button
                className={styles.link_button}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                ikonshop.io/product/{product.id}
              </button>
              <TrashBin
                style={{
                  color: "#000",
                  fontSize: "24px",
                  marginLeft: "2px",
                  marginTop: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this link?") ==
                    true
                  ) {
                    deleteSingleProduct(product.id),
                      // delete product from userLinks using it's index position
                      setUserTipJar(userTipJar.filter((_, i) => i !== index));
                  } else {
                    return;
                  }
                }}
              />

              {/* <Clipboard
                className={styles.copy_icon}
                icon={faCopy}
                style={{
                  color: "#000",
                  fontSize: "24px",
                  marginLeft: "6px",
                  marginTop: "-2px",
                  cursor: "pointer",
                }}
                onClick={() => navigator.clipboard.writeText(`https://ikonshop.io/product/${product.id}`)}
              /> */}
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
  }, [publicKey]);

  useEffect(() => {
    if (showGreen) {
      setTimeout(() => {
        setShowGreen(false);
      }, 5000);
    }
  }, [showGreen]);

  return (
    <div className={styles.parent_container}>
      <div className={styles.main_container}>
        {publicKey && loading ? renderLoading() : null}
        {!loading 
          ? renderDisplay()
          : null}
        
      </div>
    </div>
  );
}
export default CurrentLinks;
