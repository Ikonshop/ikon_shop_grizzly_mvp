import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useWallet } from "@solana/wallet-adapter-react";
import { GetTotalUsers } from "../../lib/api";
import styles from "../../styles/Merchant.module.css";
import Loading from "../Loading";
// MERCHANT COMPONENTS
import Create from "./Create";
import Orders from "./Orders";
import Products from "./Products";
import InvoiceOpen from "./Invoices/InvoiceOpen";
import PayRequests from "./PayRequests";
import StoreSettings from "./StoreSettings";
import Overview from "./Overview";
// import StoreData from "../../components/Merchant/StoreData";
import Subscriptions from "../../components/Merchant/Subscriptions/Subscriptions";
import { isMerchant } from "../../hooks/checkAllowance";
import {
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoLayersOutline,
  IoSettingsOutline,
  IoArrowForward,
  IoFileTrayFullOutline,
  IoBarChartOutline,
  IoRocketOutline,
} from "react-icons/io5";
import {Magic} from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";

config.autoAddCss = false;
const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

function MerchantDashboard() {
  const [loading, setLoading] = useState(true);
  const [userPublicKey, setUserPublicKey] = useState();
  
  const [activeMenu, setActiveMenu] = useState();
  const [totalUsers, setTotalUsers] = useState(0);
  const router = useRouter();
  const { publicKey } = useWallet();

  // MERCHANT DASHBOARD CONSTANTS
  const [showMerchantDash, setShowMerchantDash] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubHub, setShowSubHub] = useState(false);
  const [showPayRequests, setShowPayRequests] = useState(false);
  const [merchant, setMerchant] = useState(false);

  const renderLoading = () => <Loading />;

  const renderDisplay = () => (
    <div className={styles.merchant_container}>
      <Overview publicKey={userPublicKey} />
    </div>
  );

  const renderInvoices = () => (
    <div className={styles.merchant_container}>
      <InvoiceOpen owner={userPublicKey} />
    </div>
  );


  // MERCHANT DASHBOARD
  const renderMerchantDashboard = () => {
    return (
      <>
        <div className={styles.merchant_dashboard}>
          <button
            id="overview"
            disabled={!userPublicKey}
            className={
              activeMenu == "overview"
                ? "active_dash dash-button"
                : "dash-button"
            }
            onClick={() => (
              setShowInventory(false),
              setShowOrders(false),
              setShowCreate(false),
              setShowSettings(false),
              setShowSubHub(false),
              setShowPayRequests(false),
              setActiveMenu("overview")
            )}
          >
            <IoBarChartOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Overview</span>
          </button>

          <button
            id="products"
            disabled={!userPublicKey}
            className={
              activeMenu == "products"
                ? "active_dash dash-button"
                : "dash-button"
            }
            onClick={() => (
              setShowOrders(false),
              setShowCreate(false),
              setShowInventory(true),
              setShowSettings(false),
              setShowSubHub(false),
              setShowPayRequests(false),
              setActiveMenu("products")
            )}
          >
            <IoLayersOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Products</span>
          </button>

          <button
            id="orders"
            disabled={!userPublicKey}
            className={
              activeMenu == "orders" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowInventory(false),
              setShowCreate(false),
              setShowOrders(true),
              setShowSettings(false),
              setShowSubHub(false),
              setShowPayRequests(false),
              setActiveMenu("orders")
            )}
          >
            <IoFileTrayFullOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Orders</span>
          </button>
          <button
            id="settings"
            disabled={!userPublicKey}
            className={"dash-button"}
            onClick={() => (
              setShowOrders(false),
              setShowCreate(false),
              setShowInventory(false),
              setShowSettings(true),
              setShowSubHub(false),
              setShowPayRequests(false),
              setActiveMenu("settings")
            )}
          >
            <IoSettingsOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Settings</span>
          </button>
          {/* <button className="dash-button" onClick={() => router.push("/")}>
            <IoArrowBackOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Back to Home</span>
          </button> */}
          <div className={styles.ikonshop_users}>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <p>
              <strong>{totalUsers}</strong> merchants/users on IkonShop.
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderAllPayRequests = () => {
    return (
      <>
        <div className={styles.create_component}>
          <PayRequests publicKey={userPublicKey} />
        </div>
      </>
    );
  };

  const renderSubHubComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <Subscriptions />
        </div>
      </>
    );
  };

  const renderCreateComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <Create />
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

  const renderInventoryComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <Products />
        </div>
      </>
    );
  };

  const renderSettingsComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <StoreSettings />
        </div>
      </>
    );
  };

  const renderNotConnected = () => {
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

  const renderNotMerchant = () => {
    return (
      <>
        <div>
          <div className={styles.connect_wallet}>
            <IoInformationCircleOutline className={styles.info_icon} />
            <div className={styles.connect_wallet_text}>
              <h4>You are not a Merchant.</h4>
              <Link href="/register" >
                <h4 style={{ cursor:'pointer', textDecoration:'underline'}}><IoRocketOutline className={styles.icon}/> <span>Click here.</span></h4>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (publicKey) {
      setUserPublicKey(publicKey.toString());
      //add window event listener for view_all_orders that sets showOrders to true
      window.addEventListener("view_all_orders", () => {
        console.log("view all orders triggered");
        setShowOrders(true);
      });
    }
  }, [publicKey]);

  useEffect(() => {
    // SETTINGS CHECK
    const urlParams = new URLSearchParams(window.location.search);
    const settings = urlParams.get("merchantSettings");
    if (settings === "true") {
      setShowSettings(true);
    }
    if (!publicKey && !userPublicKey) {
      setLoading(false);
    }

    // SERVER CONSTANTS
    if(totalUsers === 0){
      async function getUsers () {
        const data = await GetTotalUsers();
        console.log('users', data);
        setTotalUsers(data);
      }
      getUsers();
    }

    // EVENT LISTENERS
    window.addEventListener("magic-logged-in", () => {
      localStorage.getItem("userMagicMetadata").then((data) => {
        const user = JSON.parse(data);
        const pubKey = new web3.PublicKey(user.publicAddress);
        setUserPublicKey(pubKey.toString());
      });
    });
    window.addEventListener("magic-logged-out", () => {
      setUserEmail(null);
      setUserPublicKey(null);
      setCurrentWallet(null);
      localStorage.removeItem("userMagicMetadata");
    });
  }, []);

  useEffect(() => {
    async function checkAllowance(){
      await isMerchant(userPublicKey).then((data) => {
        if(data === true){
          setMerchant(true);
          setLoading(false);
        }else{
          console.log('not a merchant');
          setMerchant(false);
          setLoading(false);
        }
      })
    }
    if(userPublicKey){
      checkAllowance();
    }
  }, [userPublicKey]);

  // use effect to add window event listeners
  useEffect(() => {
    window.addEventListener("merchant_show_overview", () => {
      setShowInventory(false),
      setShowOrders(false),
      setShowCreate(false),
      setShowSettings(false),
      setShowPayRequests(false)
    });
    window.addEventListener("merchant_show_orders", () => {
      setShowOrders(true);
      setShowInventory(false),
      setShowCreate(false),
      setShowSettings(false),
      setShowSubHub(false),
      setShowPayRequests(false)
    });
    window.addEventListener("merchant_show_inventory", () => {
      setShowInventory(true);
      setShowOrders(false),
      setShowCreate(false),
      setShowSettings(false),
      setShowSubHub(false),
      setShowPayRequests(false)
    });
    window.addEventListener("merchant_show_create", () => {
      setShowInventory(false),
      setShowOrders(false),
      setShowCreate(true),
      setShowSubHub(false),
      setShowPayRequests(false)
    });
    window.addEventListener("merchant_show_settings", () => {
      setShowSettings(true),
      setShowInventory(false),
      setShowOrders(false),
      setShowCreate(false),
      setShowSubHub(false),
      setShowPayRequests(false)
    });
  
  }, []);

  return (
    <div className={styles.parent_container}>
      {/* <DashboardHeader /> */}
      {showMerchantDash ? renderMerchantDashboard() : null}
      <div className={styles.main_container}>
        {!publicKey && !userPublicKey ? renderNotConnected() : null}
        {userPublicKey && loading ? renderLoading() : null}

        {userPublicKey &&
        merchant &&
        !loading &&
        !showCreate &&
        !showOrders &&
        !showSubHub &&
        !showInventory &&
        !showSettings
          ? renderDisplay()
          : null}
        {merchant && userPublicKey && showPayRequests && renderAllPayRequests()}
        {merchant && userPublicKey && showCreate && renderCreateComponent()}
        {merchant && userPublicKey && showOrders && renderOrdersComponent()}
        {merchant && userPublicKey && showSubHub && renderSubHubComponent()}
        {merchant && userPublicKey && showInventory && renderInventoryComponent()}
        {merchant && userPublicKey && showSettings && renderSettingsComponent()}
        {!merchant && userPublicKey && !loading ? renderNotMerchant() : null}
      </div>
    </div>
  );
}
export default MerchantDashboard;
