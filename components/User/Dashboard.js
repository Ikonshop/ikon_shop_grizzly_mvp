import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useWallet } from "@solana/wallet-adapter-react";
import { isUser } from "../../hooks/checkAllowance";
import styles from "../../styles/Merchant.module.css";
import Loading from "../Loading";

// USER COMPONENTS
import Orders from "./Link-Orders";
import UserOrders from "./User-Orders";
import Profile from "./Profile";
import CreateLink from "./Create-Link";
import {
  getCollectionOwner,
  GetUserDashLinkTotals,
  GetUserDashTipjarTotals,
  UpdateWallet,
} from "../../lib/api";
import {
  GetPublickeyCreditScore,
  GetPublickeyTwitterPfpScore,
  GetPublickeyDiamondHandScore,
  GetPublickeyMintLoverScore,
  GetTokenAddressRoyaltyContribution,
  GetPublickeyWealth,
  GetPublickeyDemographics,
  GetPublickeyTransactionFrequency,
  GetPublickeyTransactionVolume,
  GetPublickeySecondaryMarketActivity,
  GetPublickeyProfitLoss,
} from "../../lib/Atadia/api";
import {
  IoArrowBackOutline,
  IoBarChartOutline,
  IoDocumentOutline,
  IoFileTrayFullOutline,
  IoInformationCircleOutline,
  IoLinkOutline,
  IoChevronDown,
  IoTrashBin,
  IoFingerPrintSharp,
  IoCopy,
  IoEye,
  IoLink,
  IoGift,
  IoCheckmark,
  IoClose,
  IoEyeOff,
  IoChevronUp,
} from "react-icons/io5";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";

config.autoAddCss = false;
const rpcUrl =
  "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [allowance, setAllowance] = useState(false);
  const [currentWallet, setCurrentWallet] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const { publicKey, connected } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState();
  const [userEmail, setUserEmail] = useState();
  // USER DASHBOARD CONSTANTS
  const [showUserDash, setShowUserDash] = useState(true);
  const [showUserOrders, setShowUserOrders] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [showLinkOrders, setShowLinkOrders] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userLinks, setUserLinks] = useState([]);
  const [totalLinkSales, setTotalLinkSales] = useState(0);
  const [totalLinkCount, setTotalLinkCount] = useState(0);
  const [userTipJar, setUserTipJar] = useState([]);
  const [totalTipJarSales, setTotalTipJarSales] = useState(0);
  const [totalTipJarCount, setTotalTipJarCount] = useState(0);

  // ATADIA CONSTANTS
  const [atadiaLoading, setAtadiaLoading] = useState(false);
  const [creditScore, setCreditScore] = useState();
  const [creditProb, setCreditProb] = useState();

  // BALANCE CONSTANTS
  const [magicBalance, setMagicBalance] = useState(0);
  const [magicBalanceUSD, setMagicBalanceUSD] = useState(0);
  const [balanceHide, setBalanceHide] = useState(false);

  // USER DASHBOARD CONSTANTS
  const [showDropdown, setShowDropdown] = useState(false);

  const renderLoading = () => <Loading />;

  // USER DASHBOARD
  const renderUserDashboard = () => {
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
              setShowCreateLink(false),
              setShowUserOrders(false),
              setShowLinkOrders(false),
              setShowUserProfile(false),
              setActiveMenu("overview")
            )}
          >
            <IoBarChartOutline />

            <span id={styles.full_screen}>Overview</span>
          </button>
          <button
            id="order"
            disabled={!userPublicKey}
            className={
              activeMenu == "order" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowCreateLink(false),
              setShowLinkOrders(false),
              setShowUserOrders(true),
              setShowUserProfile(false),
              setActiveMenu("order")
            )}
          >
            <IoFileTrayFullOutline />
            <span id={styles.full_screen}>Txn History</span>
          </button>
          <button
            id="payreq"
            disabled={!userPublicKey}
            className={
              activeMenu == "payreq" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowLinkOrders(false),
              setShowCreateLink(true),
              setShowUserProfile(false),
              setActiveMenu("payreq")
            )}
          >
            <IoLinkOutline style={{ transform: "rotate(-45deg)" }} />

            <span id={styles.full_screen}>Pay Hub</span>
          </button>
          <button
            id="link"
            disabled={!userPublicKey}
            className={
              activeMenu == "link" ? "active_dash dash-button" : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowCreateLink(false),
              setShowLinkOrders(true),
              setShowUserProfile(false),
              setActiveMenu("link")
            )}
          >
            <IoDocumentOutline />
            <span id={styles.full_screen}>My Orders</span>
          </button>
          <button
            id="profile"
            disabled={!userPublicKey}
            className={
              activeMenu == "profile"
                ? "active_dash dash-button"
                : "dash-button"
            }
            onClick={() => (
              setShowUserOrders(false),
              setShowCreateLink(false),
              setShowLinkOrders(false),
              setShowUserProfile(true),
              setActiveMenu("profile")
            )}
          >
            <IoFingerPrintSharp />
            <span id={styles.full_screen}>Profile</span>
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

  const renderUserProfileComponent = () => {
    return (
      <>
        <div className={styles.create_component}>
          <Profile userPubKey={userPublicKey} />
        </div>
      </>
    );
  };

  const renderDisplay = () => (
    <div className={styles.dash_container}>
      {/* <div className={styles.dash_header}>
        <div className={styles.banner_hero}>
          <div className={styles.dash_hero_text}>
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
      </div> */}

      <div className={styles.wallet_container}>
        <div className={styles.atadian_credit}>
          <h4 className={styles.paylink_header}>Wallet Balance</h4>

          <div className={styles.balance_and_hide}>
            <div className={styles.balance_container}>
              <div className={styles.sol_balance}>
                <div
                  className={styles.sol_balance_fig}
                  // if balanceHide is true, then set display to none, if false display flex
                  style={{ display: balanceHide ? "none" : "flex" }}
                >
                  <img src="/sol.png" />
                  <h3>{magicBalance.toFixed(2)}</h3>
                </div>
                <div
                  className={styles.sol_balance_fig}
                  // if balanceHide is true, then set display to none, if false display flex
                  style={{ display: balanceHide ? "flex" : "none" }}
                >
                  <img src="/sol.png" />
                  <h3>****</h3>
                </div>
              </div>

              <p
                className={styles.usdc_balance}
                style={{ display: balanceHide ? "none" : "flex" }}
              >
                ${magicBalanceUSD.toFixed(2)}
              </p>
              <p
                className={styles.usdc_balance}
                style={{ display: balanceHide ? "flex" : "none" }}
              >
                ****
              </p>
            </div>
            <div className={styles.paylink_head}>
              {/*  */}
              <IoEyeOff
                className={styles.hide}
                onClick={() => setBalanceHide(!balanceHide)}
              />
            </div>
          </div>
          <div className={styles.btn_container_wrap}>
            <div className="btn_container pay_btn">
              {!showDropdown && (
                <div className="button_drop">
                  <p
                    onClick={() => (
                      setCreateLinkType("link"), setShowCreateLink(true)
                    )}
                  >
                    Create a Paylink
                  </p>
                  <div
                    className="arrow_bg"
                    onClick={() => setShowDropdown(true)}
                  >
                    {/* when dropdown  clicked, show dropdown option to Create a Tipjar*/}
                    <IoChevronDown className="arrow_drop" />
                  </div>
                </div>
              )}
              {showDropdown && (
                <div className="button_drop_tip">
                  <p
                    onClick={() => (
                      setCreateLinkType("tipjar"), setShowCreateLink(true)
                    )}
                  >
                    Create a Tipjar
                  </p>
                  <div
                    className="arrow_bg_tip"
                    onClick={() => setShowDropdown(false)}
                  >
                    {/* when dropdown  clicked, show dropdown option to Create a Tipjar*/}
                    <IoChevronUp className="arrow_drop_tip" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.atadian_credit}>
        <div className={styles.paylink_head}>
          <h4 className={styles.paylink_header}>Total Recieved</h4>
          {/* <label className={styles.dropdown}>
            <div className={styles.dd_button}>By Quarter </div>

            <input type="checkbox" className={styles.dd_input} id="test" />

            <ul className={styles.dd_menu}>
              <li>Q1 2022</li>
              <li>Q2 2022</li>
              <li>Q3 2022</li>
              <li>Q4 2022</li>
            </ul>
          </label> */}
        </div>
        <div className={styles.royalties_paid}>
          <div>
            <h3>${(totalLinkSales + totalTipJarSales).toFixed(2)}</h3>
          </div>
        </div>
        <div className={styles.atadian_report}>
          <div className={styles.total_wrapper}>
            <div className={styles.d1}>
              <div>
                <span>
                  {(
                    totalLinkCount /
                    (totalLinkCount + totalTipJarCount)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
            </div>
            <div className={styles.d2}>
              <div>
                <span>
                  {(
                    totalTipJarCount /
                    (totalLinkCount + totalTipJarCount)
                  ).toFixed(2) * 100}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className={styles.atadian_checks}>
            <div className={styles.payreq_chart_explainer1}>
              <span></span>
              <p>Paylink</p>
            </div>
            <div className={styles.payreq_chart_explainer2}>
              <span></span>
              <p>TipJar</p>
            </div>
          </div>
        </div>
      </div>

      {/* LINKS AND TIP JAR RENDER */}
      {renderProductLinks()}
    </div>
  );

  const renderProductLinks = () => {
    return (
      <div className={styles.atadian_credit}>
        <h4 className={styles.paylink_header}>Pay Requests & TipJar</h4>
        <div className={styles.paylink_container}>
          {/* map the first 3 "products" in userLinks */}
          {userLinks.slice(0, 1).map((product, index) => (
            <div key={index} className={styles.links}>
              <div className="link_tip">
                <IoLink
                  style={{
                    color: "#fff",
                    fontSize: "20px",
                    marginTop: "2px",
                    marginRight: "5px",
                  }}
                  className="link_icon_tip"
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              </div>
              <button
                className={styles.link_button}
                onClick={() => {
                  router.push(`/product/${product.id}`);
                }}
              >
                ikonshop.io/product/{product.id}
              </button>
              <div className="pay_icons">
                <IoTrashBin
                  style={{
                    color: "#676767",
                    fontSize: "20px",
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
              </div>
            </div>
          ))}
          {userTipJar.slice(0, 1).map((product, index) => (
            <div key={index} className={styles.links}>
              <div className="link_gift">
                <IoGift
                  style={{
                    color: "#fff",
                    fontSize: "20px",
                    marginTop: "2px",
                  }}
                  className="gift_icon_tip"
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              </div>
              <button
                className={styles.link_button}
                onClick={() => router.push(`/product/${product.id}`)}
              >
                ikonshop.io/product/{product.id}
              </button>
              <div className="pay_icons">
                <IoTrashBin
                  style={{
                    color: "#676767",
                    fontSize: "20px",
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
              </div>
            </div>
          ))}
          <div className="btn_container pay_btn">
            <div
              onClick={() => setShowCreateLink(true)}
              className="button_drop"
            >
              <p>Create a Paylink</p>
              <div className="arrow_bg">
                <IoChevronDown className="arrow_drop" />
              </div>
            </div>
          </div>
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

  useEffect(() => {
    if (publicKey) {
      // checkOwnership();
      console.log("publicKey", publicKey.toString());
      setUserPublicKey(publicKey.toString());
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
        }
        setLoading(false);
      };

      const getTotals = async () => {
        const tjTotatls = await GetUserDashTipjarTotals(publicKey.toString());
        console.log("tjTotatls", tjTotatls);
        setTotalTipJarSales(tjTotatls.totalTipjarSales);
        setTotalTipJarCount(tjTotatls.totalTipjars);

        const linkTotals = await GetUserDashLinkTotals(publicKey.toString());
        console.log("linkTotals", linkTotals);
        setTotalLinkSales(linkTotals.totalLinkSales);
        setTotalLinkCount(linkTotals.totalLinks);
      };

      getAllProducts();
      getTotals();

      async function getAtadiaData() {
        setAtadiaLoading(true);
        const creditScoreData = await GetPublickeyCreditScore(
          publicKey.toString()
        );
        const twitterPfpScoreDataData = await GetPublickeyTwitterPfpScore(
          publicKey.toString()
        );
        const diamondHandScoreData = await GetPublickeyDiamondHandScore(
          publicKey.toString()
        );
        const mintLoverScoreData = await GetPublickeyMintLoverScore(
          publicKey.toString()
        );
        const tokenRoyaltyContributionData =
          await GetTokenAddressRoyaltyContribution(publicKey.toString());
        const wealthData = await GetPublickeyWealth(publicKey.toString());
        const demographicData = await GetPublickeyDemographics(
          publicKey.toString()
        );
        const txnFreqData = await GetPublickeyTransactionFrequency(
          publicKey.toString()
        );
        const txnVolumeData = await GetPublickeyTransactionVolume(
          publicKey.toString()
        );
        const secondaryMktActData = await GetPublickeySecondaryMarketActivity(
          publicKey.toString()
        );
        const profitLossData = await GetPublickeyProfitLoss(
          publicKey.toString()
        );

        setCreditScore(creditScoreData.credit_score);
        setCreditProb(creditScoreData.credit_prob);
      }
      // getAtadiaData();
    }
  }, [publicKey]);

  useEffect(() => {
    // SETTINGS
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("userSettings") === "true") {
      setShowUserProfile(true);
    }
    if (window.location.href.includes("?payhub=true")) {
      setShowCreateLink(true), setActiveMenu("payreq");
    }
    if (window.location.href.includes("?settings=true")) {
      setShowUserProfile(true), setActiveMenu("profile");
    }
    //EVENT LISTENERS
    window.addEventListener("magic-logged-in", () => {
      const user = JSON.parse(data);
      const pubKey = new web3.PublicKey(user.publicAddress);
      setUserPublicKey(pubKey.toString());
    });

    window.addEventListener("magic-logged-out", () => {
      setUserEmail(null);
      setUserPublicKey(null);
      setCurrentWallet(null);
      localStorage.removeItem("userMagicMetadata");
    });
  }, []);

  useEffect(() => {
    async function checkAllowance() {
      isUser(userPublicKey).then((isUser) => {
        if (isUser) {
          setAllowance(true);
        }
      });
    }
    if (userPublicKey) {
      checkAllowance();
    }
  }, [userPublicKey]);

  return (
    <div className={styles.parent_container}>
      {renderUserDashboard()}
      <div className={styles.main_container}>
        {!userPublicKey && !publicKey && !loading
          ? renderConnectWallet()
          : null}
        {allowance && (
          <>
            {userPublicKey && loading ? renderLoading() : null}

            {!loading &&
            userPublicKey &&
            !showUserOrders &&
            !showCreateLink &&
            !showLinkOrders &&
            !showUserProfile
              ? renderDisplay()
              : null}
            {userPublicKey && showUserOrders && renderUserOrdersComponent()}
            {userPublicKey && showCreateLink && renderCreateLinkComponent()}
            {userPublicKey && showLinkOrders && renderOrdersComponent()}
            {userPublicKey && showUserProfile && renderUserProfileComponent()}
          </>
        )}
      </div>
    </div>
  );
}
export default UserDashboard;
