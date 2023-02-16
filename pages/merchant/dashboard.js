import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useWallet } from "@solana/wallet-adapter-react";
import { CheckForWallet, CreateWallet, GetTotalUsers } from "../../lib/api";
import styles from "../../styles/Merchant.module.css";
import Loading from "../../components/Loading";
// MERCHANT COMPONENTS
import Create from "../../components/Merchant/Create";
import Orders from "../../components/Merchant/Orders";
import Products from "../../components/Merchant/Products";
import InvoiceOpen from "../../components/Merchant/Invoices/InvoiceOpen";
import PayRequests from "../../components/Merchant/PayRequests";
import StoreSettings from "../../components/Merchant/StoreSettings";
import Overview from "../../components/Merchant/Overview";
import { CreateCollectionFromMagic, CheckForCollectionByOwner  } from "../../lib/api";
// import StoreData from "../../components/Merchant/StoreData";
import Subscriptions from "../../components/Merchant/Subscriptions/Subscriptions";
import {
  IoArrowBackOutline,
  IoDocumentTextOutline,
  IoInformationCircleOutline,
  IoLayersOutline,
  IoLinkOutline,
  IoSettingsOutline,
  IoStatsChartOutline,
  IoTicketOutline,
  IoArrowForward,
  IoFileTrayFullOutline,
  IoLayers,
  IoBarChartOutline,
  IoHourglass,
} from "react-icons/io5";
import {Magic} from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";

config.autoAddCss = false;
const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userPublicKey, setUserPublicKey] = useState();
  const [userEmail, setUserEmail] = useState();
  const [currentWallet, setCurrentWallet] = useState([]);
  const [accessGranted, setAccessGranted] = useState(true);
  const [renderNfts, setRenderNfts] = useState(false);
  const [nftDisplay, setNftDisplay] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const fakeNftDisplay = [
    "https://www.arweave.net/2WNOsLI3Us3d205sZVkvvkgpEIPjrtbgN3c7VrhWxcg?ext=png",
    "https://wvhvakczb3yg4gnsybgdbss4cczqt2fks7zmjus4ftqcxc7kkrqa.arweave.net/tU9QKFkO8G4ZssBMMMpcELMJ6KqX8sTSXCzgK4vqVGA?ext=png",
    "https://www.arweave.net/QAt7CY9wwVOf50cuuqrqNdcTqVAKzgg5Xl8tddOoxb8?ext=png",
  ];
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

  const renderNftDisplay = () => (
    <div className={styles.merchant_nft_container}>
      <span>My NFTs</span>
      {nftDisplay.map((nft) => (
        <img src={nft} className={styles.merchant_nft} />
      ))}
    </div>
  );

  const renderQuickActions = () => (
    //render 2 buttons one for setShowCreate(true) and one for setStoreSettings(true)
    <div className={styles.merchant_quick_actions}>
      <div className={styles.merchant_quick_action_header}>
        <h4>Quick Actions</h4>
      </div>
      <div className={styles.merchant_quick_action_button_container}>
        <button
          className={styles.merchant_quick_action_button1}
          onClick={() => setShowCreate(true)}
        >
          Create a Product
        </button>
        <button
          className={styles.merchant_quick_action_button}
          onClick={() => setShowSettings(true)}
        >
          Store Settings <IoArrowForward />
        </button>
      </div>
    </div>
  );

  const renderDisplay = () => (
    <div className={styles.merchant_container}>
      <Overview publicKey={userPublicKey} />
      {renderQuickActions()}
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
          {/* <img
            className={styles.ik_logo_full}
            src="/newlogo.png"
            style={{
              maxWidth: "100px",
              margin: "20px auto 30px auto",
            }}
          /> */}
          <img
            className={styles.ik_logo}
            src="/iklogo.png"
            style={{
              maxWidth: "30px",
              margin: "20px auto 30px auto",
            }}
          />
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
{/* 
          <button
            disabled={!publicKey}
            className="dash-button"
            onClick={() => (
              setShowOrders(false),
              setShowCreate(false),
              setShowInventory(false),
              setShowSettings(false),
              setShowSubHub(false),
              setShowInvoices(true)
            )}
          >
            <IoHourglass className={styles.side_icon} />
            <span id={styles.full_screen}>Invoices</span>
          </button> */}

          {/* <button
            id="subs"
            disabled={!publicKey}
            className={"dash-button"}
            onClick={() => (
              setShowOrders(false),
              setShowCreate(false),
              setShowInventory(false),
              setShowSettings(false),
              setShowSubHub(true),
              setShowPayRequests(false),
              setActiveMenu("subs")
            )}
          >
            <IoTicketOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Subscriptions</span>
          </button> */}
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
          <button className="dash-button" onClick={() => router.push("/")}>
            <IoArrowBackOutline className={styles.side_icon} />
            <span id={styles.full_screen}>Back to Home</span>
          </button>
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

  useEffect(() => {
    if (publicKey) {
      setCurrentWallet(publicKey.toString());
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      setUserPublicKey(publicKey.toString());
      const getData = async () => {
        const data = await CheckForCollectionByOwner(publicKey.toString())

        console.log('data', data)
        if(data === true){
          console.log('setting merchant to true')
          setMerchant(true);
        }
        const walletData = await CheckForWallet(publicKey.toString());
        if (walletData.wallet === null) {
          const newWallet = CreateWallet(publicKey.toString());
          if (newWallet) {
            console.log(
              "welcome to ikonshop, if you have any issues please reach out to us on discord"
            );
          }
        } else {
          console.log(
            "welcome to ikonshop, if you have any issues please reach out to us on discord"
          );
        }
         
        if(data === false){
          router.push('/register')
        }
      };
      getData();
      setLoading(false);
    }
    if(!publicKey, userPublicKey){
      const getData = async () => {
        const data = await CheckForCollectionByOwner(userPublicKey)

        console.log('data', data)
        if(data === true){
          console.log('setting merchant to true')
          setMerchant(true);
        }
        const walletData = await CheckForWallet(userPublicKey);
        if (walletData.wallet === null) {
          const newWallet = CreateWallet(userPublicKey);
          if (newWallet) {
            console.log(
              "welcome to ikonshop, if you have any issues please reach out to us on discord"
            );
          }
        } else {
          console.log(
            "welcome to ikonshop, if you have any issues please reach out to us on discord"
          );
        }
         
        if(data === false){
          router.push('/register')
        }
      };
      getData();
      setLoading(false);
    }
  }, [publicKey, userPublicKey]);

  useEffect(() => {
    if (publicKey) {
      setUserPublicKey(publicKey.toString());
      //add window event listener for view_all_orders that sets showOrders to true
      window.addEventListener("view_all_orders", () => {
        console.log("view all orders triggered");
        setShowOrders(true);
      });
    }
    async function getUsers () {
      const data = await GetTotalUsers();
      console.log('users', data);
      setTotalUsers(data);
    }
    getUsers();
  }, []);

  const checkMagicLogin = async() => {
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
      extensions: {
          solana: new SolanaExtension({
          rpcUrl
          })
      }
    });
    async function checkUser() {
      const loggedIn = await magic.user.isLoggedIn();
      console.log('loggedIn', loggedIn)
      magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
        if (magicIsLoggedIn) {
          magic.user.getMetadata().then((user) => {
            localStorage.setItem('userMagicMetadata', JSON.stringify(user));
            const pubKey = new web3.PublicKey(user.publicAddress);
            setUserPublicKey(pubKey.toString());
          });
        } else {
          window.dispatchEvent(new CustomEvent("magic-logged-out"));
          setLoading(false);
        }
      });
    }
  checkUser();
  };

  useEffect(() => {
    if(!publicKey) {
      checkMagicLogin();
    }
    window.addEventListener("magic-logged-in", () => {
      checkMagicLogin();
    });
    window.addEventListener("magic-logged-out", () => {
      setUserEmail(null);
      setUserPublicKey(null);
      setCurrentWallet(null);
      localStorage.removeItem("userMagicMetadata");
    });

  }, []);

  useEffect(() => {
    if (!publicKey && !userPublicKey) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // if url has query string, set settings = to true
    // setShowSettings(false);
    //url: /merchant/dashboard?settings=true
    const urlParams = new URLSearchParams(window.location.search);
    const settings = urlParams.get("settings");
    if (settings === "true") {
      setShowSettings(true);
    }
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
      </div>
    </div>
  );
}
export default Dashboard;
