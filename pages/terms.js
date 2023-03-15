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
          <div className="termsAndConditions fadeIn">
            <h1 className="termsAndConditionsHeading">Terms Of Service</h1>

            <div className="serviceLeadingSection">
              <p className="spl">
                Welcome to IkonShop a multi-vendor marketplace built on the
                Solana blockchain. These terms and conditions ("Terms") apply to
                your use of our website and services, including any purchases
                made through our platform. By using our website and services,
                you agree to these Terms.
              </p>
              <br />
              <br />

              <h4>
                <span className="sn blue">1.</span>
                <span className="st blue">Account Creation</span>
              </h4>
              <br />

              <p className="spl">
                In order to use our platform, you must create an account. You
                are responsible for maintaining the security of your account,
                and you agree not to share your account credentials with anyone
                else. You are also responsible for any activity that occurs
                under your account.
              </p>
              <br />
              <br />
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn orange">2.</span>
                <span className="st orange">Prohibited Activities</span>
              </h4>
              <p className="spl">
                You agree not to engage in any of the following activities:
              </p>
              <br />
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Violating any laws or regulations, including those related to
                  intellectual property, privacy, and data protection.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Misrepresenting your identity, location, or affiliation with
                  any person or organization.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Posting content that is false, misleading, or fraudulent.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Engaging in any activity that could harm our platform or other
                  users, including introducing viruses, malware, or other
                  harmful code.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Interfering with or disrupting the functioning of our platform
                  or services.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  Engaging in any other activity that is not in compliance with
                  these Terms or our community guidelines.
                </p>
                <div className="secionLine lineColorOrange"></div>
              </div>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn lightGreen">3.</span>
                <span className="st lightGreen">
                  Vendor and Buyer Agreement
                </span>
              </h4>
              <p className="spl">
                Our platform allows vendors to sell goods and services to
                buyers. By using our platform, vendors agree to the following:
              </p>
              <br />
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will only sell goods and services that are legal and not
                  in violation of any laws or regulations.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will provide accurate descriptions of their goods and
                  services, including any relevant terms and conditions.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will fulfill orders in a timely manner and communicate
                  with buyers about any issues that arise.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>

              <p className="spl">
                By using our platform, buyers agree to the following:
              </p>
              <br />
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will only purchase goods and services that are legal and
                  not in violation of any laws or regulations.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will provide accurate information when making purchases,
                  including their shipping address and payment information.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>
              <div className="serviceInfoContainer">
                <p className="serviceDetails">
                  They will communicate with vendors about any issues that
                  arise, including issues with the quality or delivery of their
                  goods or services.
                </p>
                <div className="secionLine lineColorGreen"></div>
              </div>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn purple">4.</span>
                <span className="st purple">Payment and Fees</span>
              </h4>
              <br />
              <p className="spl">
                Our platform charges a fee for transactions that occur on our
                platform. Vendors agree to pay this fee as a percentage of their
                sales. We reserve the right to change our fees at any time.
              </p>
              <br />
              <p className="spl">
                All payments made through our platform are processed through a
                third-party payment processor. We are not responsible for any
                issues that arise with these payments.
              </p>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn color1">5.</span>
                <span className="st color1">Intellectual Property</span>
              </h4>
              <br />
              <p className="spl">
                Our platform and all content and materials contained within it,
                including trademarks, logos, and other intellectual property,
                are owned by IkonShop or its partners. You agree not to use any
                of our intellectual property without our express written
                consent.
              </p>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn color2">6.</span>
                <span className="st color2">Disclaimer of Warranties</span>
              </h4>
              <br />
              <p className="spl">
                Our platform is provided on an "as is" and "as available" basis.
                We make no warranties or representations about the accuracy or
                completeness of our platform, and we disclaim any and all
                warranties, whether express or implied, including warranties of
                merchantability, fitness for a particular purpose, and non-
                infringement.
              </p>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn color3">7.</span>
                <span className="st color3">Limitation of Liability</span>
              </h4>
              <br />
              <p className="spl">
                To the maximum extent permitted by law, we will not be liable
                for any indirect, special, incidental, or consequential damages
                arising out of or in connection with your use of our platform,
                even if we have been advised of the possibility of such damages.
              </p>
            </div>

            <div className="serviceLeadingSection">
              <h4>
                <span className="sn color4">8.</span>
                <span className="st color4">Indemnification</span>
              </h4>
              <br />
              <p className="spl">
                You agree to indemnify, defend, and hold harmless IkonShop its
                affiliates, and their respective officers, directors, employees,
                and agents, from and against any and all claims, liabilities,
                damages, losses, costs, expenses, or fees (including reasonable
                attorneys' fees) arising out of or in connection with your use
                of our platform, your violation of these Terms, or your
                violation of any rights of another person or entity.
              </p>
            </div>

            <a href="https://ikonshop.io">
              <h4 className="closeTerms">BACK TO HOMEPAGE</h4>
            </a>
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
