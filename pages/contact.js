import React, { useState, useEffect, Audio } from "react";
import HeadComponent from "../components/Head";
import Loading from "../components/Loading";
import { getStoreTeaser } from "../lib/api";
import { useRouter } from "next/router";

// MERCHANT COMPONENTS
import Create from "../components/Merchant/Create";
import Orders from "../components/Merchant/Orders";
import Products from "../components/Merchant/Products";
// USER COMPONENTS
import UserOrders from "../components/User/User-Orders";
import CreateLink from "../components/User/Create-Link";

// import "glider-js/glider.min.css";


// Constants
const TWITTER_HANDLE = "TopShotTurtles";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
export const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
export const WEB3STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;

const App = () => {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(true);
  const [activeWallet, setActiveWallet] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="contact">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSevzce9N5rjVbWiLTwWBL9QIKbWk1iX--AOilovd6gu4gDBYQ/viewform"
            style={{
              width: "100%",
              height: "150vh",
            }}
          ></iframe>
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
      <div className="container">
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
      </div>
    </div>
  );
};

export default App;
