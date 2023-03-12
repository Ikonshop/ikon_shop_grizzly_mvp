import React, { useEffect, useState } from "react";
// import { Magic } from "magic-sdk";
// import { SolanaExtension } from "@magic-ext/solana";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import {
  CheckForWallet,
  CreateWallet,
  getCollectionOwner,
  CheckForCollectionByOwner,
  UpdateWallet,
} from "../lib/api";
import { isMerchant, isUser, addUser } from "../hooks/checkAllowance";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LogoDiscord, LogoTwitter } from "react-ionicons";
import dynamic from "next/dynamic";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import LoginMagic from "./MagicWallet/login";
import QuickActions from "./MagicWallet/quickActions";
import {
  IoRocketOutline,
  IoSpeedometerOutline,
  IoMenuOutline,
  IoLogoDiscord,
  IoLogoTwitter,
  IoLogInOutline,
  IoLogOutOutline,
  IoAccessibilityOutline,
  IoStorefrontOutline,
  IoWalletOutline,
  IoBarChartOutline,
  IoLayersOutline,
  IoSettingsOutline,
  IoFileTrayFullOutline,
  IoLinkOutline,
  IoDocumentOutline,
  IoFingerPrintSharp,
  IoFlashOutline,
  IoArrowBack
} from "react-icons/io5";
// import LoginMagic from "./MagicWallet/login";
// import LogoutMagic from "./MagicWallet/logout";
// import QuickActions from "./MagicWallet/quickActions";
import { getBalance, getUsdcBalance } from "../hooks/getBalance";
import * as web3 from "@solana/web3.js";
import styles from "../styles/Header.module.css";

// import Head from "next/head";

export default function HeaderComponent() {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();
  const currentPath = router.pathname;
  const [showMenu, setShowMenu] = useState(false);
  const [showStoreSymbol, setShowStoreSymbol] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [loginOptionSelected, setLoginOptionSelected] = useState('');
  const [userPublicKey, setUserPublicKey] = useState("");
  const [merchant, setMerchant] = useState(false);
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(false);
  // BROWSER WALLET
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  // MAGIC WALLET
  const [showMagicLogin, setShowMagicLogin] = useState(false);
  const [magicMetadata, setMagicMetadata] = useState(null);
  const [magicUser, setMagicUser] = useState(false);
  const [email, setEmail] = useState(null);
  const [magicPublicKey, setMagicPublicKey] = useState(null);
  const [magicBalance, setMagicBalance] = useState(0);
  const [magicUsdcBalance, setMagicUsdcBalance] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);

  //wallet check
  const connection = new web3.Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const rpcUrl =
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

  const renderQuickActions = () => {
    return (
      <div className={styles.quickActions}>
        <QuickActions
          magicMetadata={magicMetadata}
          magicPublicKey={magicPublicKey}
          magicBalance={magicBalance}
          magicUsdcBalance={magicUsdcBalance}
        />
      </div>
    );
  };

  const renderHeaderMenu = () => {
    return (
      <div className={styles.menuContainer}>
        <div onClick={()=> (setShowMenu(false), setShowLoginOptions(false), setLoginOptionSelected(''))} className={styles.menuOverlay}></div>
        <div className={styles.menu}>
          {/* if currentpath is /dashboard then renderDashToggle */}
          {userPublicKey && currentPath === "/dashboard" && renderDashToggle()}
          {userPublicKey && !merchant &&(
            <div className={styles.menuItem}>
              <Link href="/dashboard">
                <a
                  onClick={() => (
                    setShowMenu(false),
                    setShowLoginOptions(false),
                    setShowQuickActions(false)
                  )}
                >
                  <IoSpeedometerOutline className={styles.icon} />{" "}
                  <span>Dashboard</span>
                </a>
              </Link>
            </div>
          )}
          {userPublicKey && merchant &&(
            <div className={styles.menuItem}>
              <Link href="/dashboard">
                <a
                  onClick={() => (
                    setShowMenu(false),
                    setShowLoginOptions(false),
                    setShowQuickActions(false)
                  )}
                >
                  <IoSpeedometerOutline className={styles.icon} />{" "}
                  <span>Dashboard</span>
                </a>
              </Link>
            </div>
          )}

          {/* LOGIN LINK */}
          {!userPublicKey &&
            <div onClick={()=> (setShowLoginOptions(true), setShowQuickActions(false))}  className={styles.menuItem}>
              <IoLogInOutline className={styles.icon} /> <span>Connect to App</span>
            </div>
          }
          {!merchant && userPublicKey &&(
            <div onClick={()=> (router.push('/register'), setShowLoginOptions(false), setShowQuickActions(false))} className={styles.menuItem}>
              <IoFlashOutline className={styles.icon} /> <span>Register as Merchant</span>
            </div>
          )}
          {/* MAGIC QUICK ACTION LINK */}
          {magicUser && (
            <div onClick={()=> (setShowQuickActions(!showQuickActions), setShowLoginOptions(false), setShowMenu(false))} className={styles.menuItem}>
              <IoWalletOutline className={styles.icon} /> <span>Wallet</span>
            </div>
          )}
          {/* LOGGED IN  */}
          {userPublicKey != "" && (
            <div
              onClick={() => (
                setShowLoginOptions(true), setShowQuickActions(false)
              )}
              className={styles.menuItem}
            >
              <IoLogOutOutline className={styles.icon} /> <span>Logout</span>
            </div>
          )}
          {/* SOCIALS */}
          <div className={styles.socialItem}>
            <a href="https://discord.com/invite/ikons">
              <IoLogoDiscord className={styles.socialIcon} />
            </a>
            <a href="https://twitter.com/ikonshopapp">
              {" "}
              <IoLogoTwitter className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailLogin = () => {
    return (

        <div className={styles.loginOption}>
          Email:
          <LoginMagic />

          <span onClick={()=> setLoginOptionSelected('')}><IoArrowBack />back</span>
        </div>
 
    )
  };

  const renderWalletLogin = () => {
    return (
      
        <div className={styles.loginOption}>
          Browser Wallet:
          <WalletMultiButton />

          <span onClick={()=> setLoginOptionSelected('')}><IoArrowBack />back</span>
        </div>
    
    )
  };

  const renderLoginOptionsSelect = () => {
    return (
      <div>
        <h3>Connect with:</h3>
        <div className={styles.loginOption}>
          <span onClick={() => setLoginOptionSelected('email')}>Email</span>
        </div>
        <div className={styles.loginOption}>
          <span onClick={() => setLoginOptionSelected('wallet')}>Browser Wallet</span>
        </div>
      </div>
    )
  };

  const renderLoginOptions = () => {
    return (
      <div className={styles.loginOptions}>
        {loginOptionSelected === 'email' && renderEmailLogin()}
        {loginOptionSelected === 'wallet' && renderWalletLogin()}
        {loginOptionSelected === '' && renderLoginOptionsSelect()}
        <button
          className={styles.closeButton}
          onClick={() => (setShowLoginOptions(false), setLoginOptionSelected(''))}
        >
          X
        </button>
      </div>
    );
  };

  const renderDashToggle = () => {
    return (
      <>
        {!loading && merchant && (
          <div className={styles.toggleItem}>
            <div
              id="container"
              onClick={() =>
                showStoreSymbol
                  ? window.dispatchEvent(new Event("toggle-user"))
                  : window.dispatchEvent(new Event("toggle-merchant"))
              }
            >
              {!showStoreSymbol ? (
                <div id="target" class="moon">
                  <IoAccessibilityOutline className="moon_tog" />
                </div>
              ) : (
                <div id="target" class="sun">
                  <IoStorefrontOutline className="sunny_tog" />
                </div>
              )}
            </div>
            <span>{showStoreSymbol ? "Merchant" : "User"}</span>
          </div>
        )}
      </>
    );
  };

  async function gatherMagicData() {
    try {
      const data = localStorage.getItem("userMagicMetadata");
      const parsedData = await JSON.parse(data);

      const magicKey = new web3.PublicKey(parsedData.publicAddress);
      await getBalance(magicKey).then(() => {
        setMagicBalance(magicBalance);
      });
      await getUsdcBalance(magicKey).then(() => {
        setMagicUsdcBalance(magicUsdcBalance);
      });
      setMagicMetadata(parsedData);
      setUserPublicKey(magicKey.toString());
      setMagicUser(true);
      const getData = async () => {
        await CheckForWallet(magicKey.toString()).then((walletData) => {
          if (walletData === null) {
            const newWallet = CreateWallet(
              magicKey.toString(),
              parsedData.email
            );
          }
        });
        await CheckForCollectionByOwner(magicKey.toString()).then(
          (collectionData) => {
            if(collectionData){
              setMerchant(true);
            }
          }
        );
      };
      getData();
    } catch (e) {
      console.log("error: ", e);
    }
  }

  useEffect(() => {
    if (publicKey && magicUser) {
      alert("Two wallets detected, please log out of one.")
    }
    if (!publicKey && magicUser) {
      setUserPublicKey(magicMetadata.publicAddress);
      setShowLoginOptions(false);
    }
    if (!publicKey && !magicUser) {
      setUserPublicKey("");
    }
    if (publicKey) {
      setUserPublicKey(publicKey.toString()), setShowLoginOptions(false);
    }
  }, [publicKey]);

  useEffect(() => {
    // toggle for 'showStoreSymbol' in navbar
    window.addEventListener("toggle-user", () => {
      setShowStoreSymbol(false);
    });
    window.addEventListener("toggle-merchant", () => {
      setShowStoreSymbol(true);
    });
  }, []);

  useEffect(() => {
    console.log("window.location.pathname", window.location.search);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get("userSettings") === "true") {
      setShowStoreSymbol(false);
    }
    if (urlParams.get("merchantSettings") === "true") {
      setShowStoreSymbol(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("magic-logged-in", () => {
      if(!userPublicKey){
        gatherMagicData();
        setMagicUser(true);
      }
    });
    window.addEventListener("magic-logged-out", () => {
      setMagicMetadata("");
      setMagicPublicKey("");
      setUserPublicKey("");
      setMagicUser(false);
      if (publicKey) {
        setUserPublicKey(publicKey.toString());
      }
    });
    window.addEventListener("closeQuickActions", () => {
      setShowQuickActions(false);
    });
  }, []);

  useEffect(() => {
    async function checkAllowance() {
      await isUser(userPublicKey).then((data) => {
        if (data === true) {
          setUser(true);
          setLoading(false);
        } else {
          console.log("not a user");
          setUser(false);
          setLoading(false);
        }
      });
      await isMerchant(userPublicKey).then((data) => {
        if (data === true) {
          setMerchant(true);
          setLoading(false);
        } else {
          console.log("not a merchant");
          setMerchant(false);
          setLoading(false);
        }
      });
    }
    if (userPublicKey) {
      checkAllowance();
    }
  }, [userPublicKey]);

  return (
    <div className={styles.navbar}>
      <div onClick={() => router.push("/")} className={styles.logo}>
        <img className={styles.bigLogo} src="/newlogo.png" alt="logo" />
        {/* <img className={styles.smallLogo} src="/newlogo.png" alt="logo" /> */}
      </div>
      <div className={styles.hamburger} onClick={() => setShowMenu(!showMenu)}>
        <IoMenuOutline size={30} />
      </div>
      {showMenu && renderHeaderMenu()}
      {showLoginOptions && renderLoginOptions()}
      {showQuickActions && renderQuickActions()}
    </div>
  );
}
