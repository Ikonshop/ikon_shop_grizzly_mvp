import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useWallet } from "@solana/wallet-adapter-react";
import { isUser } from "../../hooks/checkAllowance";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { checkMagicLogin } from "../../hooks/checkMagicLogin";
import styles from "../../styles/Merchant.module.css";
import Loading from "../Loading";
import CheckingForWallet from "../LoadingWalletCheck";

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
  IoLogOutOutline,
} from "react-icons/io5";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";

config.autoAddCss = false;
//wallet check
const connection = new web3.Connection(
  "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
  "confirmed"
);
const rpcUrl =
  "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(true);
  const [checkingForWallet, setCheckingForWallet] = useState(true);
  const [allowance, setAllowance] = useState(false);
  const [currentWallet, setCurrentWallet] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const { publicKey, connected } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState();
  const [noLinks, setNoLinks] = useState(true);

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
  const [createLinkType, setCreateLinkType] = useState("");

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
        <div className={styles.create_component}>
          <CreateLink type={createLinkType} />
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
              onClick={() => window.dispatchEvent(new Event("user_show_pay_hub"))}
              id={styles.full_screen}
              className="hero-button"
            >
              Start Selling
            </button>
          </div>
          <div className={styles.hero_overlay}></div>
        </div>
        </div> */}

      {/* <div className={styles.wallet_container}> */}
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
                <h3>{magicBalance ? magicBalance.toFixed(2) : "---"}</h3>
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
              ${magicBalanceUSD ? magicBalanceUSD.toFixed(2) : "---"}
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
      </div>
      {/* </div> */}

      <div className={styles.total_container}>
        <div className={styles.paylink_head}>
          <h4 className={styles.paylink_header}>Total Recieved</h4>
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
                    (totalLinkCount / (totalLinkCount + totalTipJarCount)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
            <div className={styles.d2}>
              <div>
                <span>
                  {(
                    (totalTipJarCount / (totalLinkCount + totalTipJarCount)) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className={styles.atadian_checks}>
            <div className={styles.payreq_chart_explainer1}>
              <span></span>
              <p>Paylink:</p>{" "}
              <p className={styles.mobile_total}>${totalLinkSales}</p>
            </div>
            <div className={styles.payreq_chart_explainer2}>
              <span></span>
              <p>TipJar:</p>
              <p className={styles.mobile_total}>${totalTipJarSales}</p>
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
      <div className={styles.atadian_credit2}>
        <h4 className={styles.paylink_header}>Pay Requests & TipJar</h4>
        <div className={styles.paylink_container}>
          {/* map the first 3 "products" in userLinks */}
          {!linksLoading && userLinks.length < 1 && userTipJar.length < 1
            ? renderNoLinks()
            : null}
          {!linksLoading &&
            userLinks.slice(0, 1).map((product, index) => (
              <div key={index} className={styles.links}>
                <div className="link_tip">
                  <IoLink
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      marginTop: "7px",
                      marginLeft: "5px",
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
                  {product.name}
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
          {!linksLoading &&
            userTipJar.slice(0, 1).map((product, index) => (
              <div key={index} className={styles.links}>
                <div className="link_gift">
                  <IoGift
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      marginTop: "7px",
                      marginLeft: "5px",
                    }}
                    className="gift_icon_tip"
                    onClick={() => router.push(`/product/${product.id}`)}
                  />
                </div>
                <button
                  className={styles.link_button}
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {product.name}
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
                          setUserTipJar(
                            userTipJar.filter((_, i) => i !== index)
                          );
                      } else {
                        return;
                      }
                    }}
                  />
                </div>
              </div>
            ))}

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

  const renderNoLinks = () => (
    <div className={styles.no_orders}>
      <img src="/nolinks.png" />
      <p>You have no links</p>
    </div>
  );

  async function getBalance(pubKey) {
    const balance = await connection.getBalance(pubKey);
    console.log("balance: ", balance);
    const convertedBalance = balance / 1000000000;
    setMagicBalance(convertedBalance);
  }

  async function getUsdcBalance(pubKey) {
    const usdcAddress = new web3.PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcAddress,
        pubKey
      );
      console.log(
        "associatedTokenAddress: ",
        associatedTokenAddress.toString()
      );
      const usdcBalance = await connection.getTokenAccountBalance(
        associatedTokenAddress
      );
      console.log("usdcBalance: ", usdcBalance.value.uiAmount);
      const convertedUsdcBalance = usdcBalance.value.uiAmount;
      setMagicBalanceUSD(convertedUsdcBalance);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  useEffect(() => {
    if (publicKey) {
      console.log("publicKey", publicKey.toString());
      setUserPublicKey(publicKey.toString());
    }
    if (userPublicKey) {
      setCurrentWallet(userPublicKey);
      const owner = userPublicKey;
      const getAllProducts = async () => {
        const products = await getCollectionOwner(owner);
        console.log("products", products);
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
        setLinksLoading(false);
      };

      if (userLinks.length > 0 && userTipJar.length > 0) {
        setNoLinks(false);
      }

      const getTotals = async () => {
        const tjTotatls = await GetUserDashTipjarTotals(userPublicKey);
        console.log("tjTotatls", tjTotatls);
        setTotalTipJarSales(tjTotatls.totalTipjarSales);
        setTotalTipJarCount(tjTotatls.totalTipjars);

        const linkTotals = await GetUserDashLinkTotals(userPublicKey);
        console.log("linkTotals", linkTotals);
        setTotalLinkSales(linkTotals.totalLinkSales);
        setTotalLinkCount(linkTotals.totalLinks);
      };

      getAllProducts();
      getTotals();

      // ATADIA API CALLS
      async function getAtadiaData() {
        setAtadiaLoading(true);
        // const creditScoreData = await GetPublickeyCreditScore(
        //   userPublicKey
        // );
        // console.log("creditScoreData", creditScoreData);
        // const twitterPfpScoreDataData = await GetPublickeyTwitterPfpScore(
        //   userPublicKey
        // );
        // console.log('twitterPfpScoreDataData', twitterPfpScoreDataData)
        // const diamondHandScoreData = await GetPublickeyDiamondHandScore(
        //   userPublicKey
        // );
        // console.log("diamondHandScoreData", diamondHandScoreData);
        const mintLoverScoreData = await GetPublickeyMintLoverScore(
          userPublicKey
        );
        console.log("mintLoverScoreData", mintLoverScoreData);
        // const tokenRoyaltyContributionData = await GetTokenAddressRoyaltyContribution(userPublicKey);
        // console.log('tokenRoyaltyContributionData', tokenRoyaltyContributionData)
        // const wealthData = await GetPublickeyWealth(userPublicKey);
        // console.log('wealthData', wealthData)
        // const demographicData = await GetPublickeyDemographics(
        //   userPublicKey
        // );
        // console.log('demographicData', demographicData)
        // const txnFreqData = await GetPublickeyTransactionFrequency(
        //   userPublicKey
        // );
        // console.log('txnFreqData', txnFreqData)
        // const txnVolumeData = await GetPublickeyTransactionVolume(
        //   userPublicKey
        // );
        // console.log('txnVolumeData', txnVolumeData)
        // const secondaryMktActData = await GetPublickeySecondaryMarketActivity(
        //   userPublicKey
        // );
        // console.log('secondaryMktActData', secondaryMktActData)
        // const profitLossData = await GetPublickeyProfitLoss(
        //   userPublicKey
        // );
        // console.log('profitLossData', profitLossData)

        // setCreditScore(creditScoreData.credit_score);
        // setCreditProb(creditScoreData.credit_prob);
      }
      // getAtadiaData();
    }
  }, [publicKey, userPublicKey]);

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
  }, []);

  // USER PUB KEY CHECK
  useEffect(() => {
    async function checkAllowance() {
      await isUser(userPublicKey).then((isUser) => {
        if (isUser) {
          setAllowance(true);
        }
      });
      const pubkey = new web3.PublicKey(userPublicKey);
      await getBalance(pubkey);
      await getUsdcBalance(pubkey);
      setLoading(false);
    }
    if (userPublicKey) {
      checkAllowance();
    }
  }, [userPublicKey]);

  // EVENT LISTENERS
  useEffect(() => {
    window.addEventListener("magic-logged-in", () => {
      try {
        const data = localStorage.getItem("userMagicMetadata");
        const user = JSON.parse(data);
        const pubKey = new web3.PublicKey(user.publicAddress);
        setUserPublicKey(pubKey.toString());
      } catch (e) {
        console.log("error", e);
      }
    });

    window.addEventListener("magic-logged-out", () => {
      setUserEmail(null);
      setUserPublicKey(null);
      setCurrentWallet(null);
      localStorage.removeItem("userMagicMetadata");
    });
    window.addEventListener("user_show_overview", () => {
      setShowUserOrders(false),
        setShowCreateLink(false),
        setShowLinkOrders(false),
        setShowUserProfile(false);
    });
    window.addEventListener("user_show_pay_hub", () => {
      setShowUserOrders(false),
        setShowLinkOrders(false),
        setShowCreateLink(true),
        setShowUserProfile(false);
    });
    window.addEventListener("user_show_txn_history", () => {
      setShowCreateLink(false),
        setShowLinkOrders(false),
        setShowUserOrders(true),
        setShowUserProfile(false);
    });
    window.addEventListener("user_show_orders", () => {
      setShowUserOrders(false),
        setShowCreateLink(false),
        setShowLinkOrders(true),
        setShowUserProfile(false);
    });
    window.addEventListener("user_show_profile", () => {
      setShowUserProfile(true),
        setShowUserOrders(false),
        setShowCreateLink(false),
        setShowLinkOrders(false),
        setShowUserProfile(true);
    });
    if (!userPublicKey) {
      console.log("checking for wallet");
      checkMagicLogin();
    }
  }, []);

  useEffect(() => {
    // in 2 seconds set checkingForWallet to false
    const timer = setTimeout(() => {
      setCheckingForWallet(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [checkingForWallet]);

  return (
    // <div className={styles.parent_container}>
    //   <div className={styles.main_container}>
    <div className="over_dash_container">
      {showUserDash ? renderUserDashboard() : null}
      {checkingForWallet && <CheckingForWallet />}
      {!userPublicKey && !checkingForWallet && !publicKey && !loading
        ? renderConnectWallet()
        : null}

      <>
        {userPublicKey && !checkingForWallet && loading
          ? renderLoading()
          : null}

        {!loading &&
        !checkingForWallet &&
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
    </div>
    // </div>
    // </div>
  );
}
export default UserDashboard;
