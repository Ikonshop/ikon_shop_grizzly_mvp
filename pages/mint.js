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
          <div className="mint_hero">
            <div className="mint_container">
              <div className="mint_row">
                <h1>Become an Ikon.</h1>
                <p>Ikon roles can mint a max of 2 NFTs per wallet</p>
                <button className="mint_btn">Mint</button>
                <div className="love_p">
                  <p>sending you ❤️ from the amazing folks at our community.</p>
                </div>
              </div>

              <img className="mint_bg" src="/mint_bg.png" />
              <div className="mint_bg2">
                <img src="/mint_bg2.png" />
              </div>

              <div className="music">
                <img src="/vinyl.gif" />
              </div>
            </div>
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
