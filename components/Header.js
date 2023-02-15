import React, { useEffect, useState } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { CheckForWallet, CreateWallet, getCollectionOwner, CheckForCollectionByOwner  } from "../lib/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ApplyToSell from "./ApplyToSell";
import "bootstrap/dist/css/bootstrap.min.css";
import { LogoDiscord, LogoTwitter } from "react-ionicons";
import dynamic from "next/dynamic";
import * as web3 from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  Connection,
  GetTokenAccountsByOwnerConfig,
  PublicKey,
  getTokenAccountsByOwner,
} from "@solana/web3.js";
import {
  IoChevronDown,
  IoSunnyOutline,
  IoMoonOutline,
  IoSwapHorizontalOutline,
  IoAccessibilityOutline,
  IoStorefrontOutline,
  IoWalletOutline,
  
} from "react-icons/io5";
import LoginMagic from "./MagicWallet/login";
import LogoutMagic from "./MagicWallet/logout";
import QuickActions from "./MagicWallet/quickActions";
import styles from "../styles/Header.module.css";


// import Head from "next/head";

export default function HeaderComponent() {
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const router = useRouter();
  const currentPath = router.pathname;
  const [merchant, setMerchant] = useState(false);

  // THEME
  const [theme, setTheme] = useState("light");
  
  //MAGIC LINK
  const [showMagicLogin, setShowMagicLogin] = useState(false);
  const [magicMetadata, setMagicMetadata] = useState(null);
  const [magicUser, setMagicUser] = useState(false);
  const [magicPublicKey, setMagicPublicKey] = useState(null);
  const [magicBalance, setMagicBalance] = useState(0);
  const [magicUsdcBalance, setMagicUsdcBalance] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);

  // MERCHANT HEADER CONSTANTS
  const [isMultiStoreOwner, setIsMultiStoreOwner] = useState(false);
  const [multiStoreArray, setMultiStoreArray] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  const [nftData, setNftData] = useState(null);

  //wallet check
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

  const handleLogout = async () => {
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
            solana: new SolanaExtension({
            rpcUrl
          })
        }
    });
    await magic.user.logout();
    localStorage.setItem("userMagicMetadata", null);
    window.dispatchEvent(new CustomEvent("magic-logged-out"));
  };


  const toggleTheme = () => {
    console.log('toggle theme')
    
    // :root {
  // --main-background: #fff;
  // --main-fonts-color: #fff;
  // --main-decor-color: -webkit-linear-gradient(left, #06beb6 30%, #48b1bf 60%);
  // --main-bg-color: #fff;

  // --main-shadow-color: #e91c1c;
  // --main-header-background: #21252e;
  // --main-font-family: "Manrope" !important;
  // overflow-x: hidden;

  if(theme === "light") {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  const isLightTheme = theme === "light" ? true : false;

  // change :root css variables that are used in App.css
  document.documentElement.style.setProperty("--main-background", isLightTheme ? "#fff" : "#21252e");
  document.documentElement.style.setProperty("--main-fonts-color", isLightTheme ? "#fff" : "#fff");  
};


    

  const renderMagicContainer = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
          border: "1px solid #130B46",
          borderRadius: "10px",
          padding: "10px",
        }}
      >
        <p>{magicMetadata.email}</p>
        <button
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </button>
        
      </div>
    );
  };

  const renderMagicLogin = () => {
    return (
      <LoginMagic />
    );
  };

  const renderMagicQuickActions = () => {
    return (
      <QuickActions 
        magicMetadata={magicMetadata} 
        magicBalance={magicBalance} 
        magicUsdcBalance={magicUsdcBalance}
      />
    );
  };
  


  const renderMultiStoreSelection = () => {
    // console.log('multiStoreArray: ', multiStoreArray)
    return (
      <div 
        onClick={toggleTheme}
        id="target" 
        class="moon"
      > 
      
        <IoMoonOutline className="moon_tog" />
    
        <div></div>
      </div>
    );
  };

  useEffect(() => {
    if (publicKey) {
    setIsMultiStoreOwner(false);
    setMultiStoreArray(null);
    setMagicPublicKey(publicKey.toString());
    async function getBalance(pubKey) {

      const balance = await connection.getBalance(pubKey);
      console.log('balance: ', balance)
      const convertedBalance = balance / 1000000000;
      setMagicBalance(convertedBalance);
    }

    async function getUsdcBalance(pubKey) {
      const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
      try{
        const associatedTokenAddress = await getAssociatedTokenAddress(usdcAddress, pubKey);
        console.log('associatedTokenAddress: ', associatedTokenAddress.toString())
        const usdcBalance = await connection.getTokenAccountBalance(associatedTokenAddress);
        console.log('usdcBalance: ', usdcBalance.value.uiAmount)
        const convertedUsdcBalance = usdcBalance.value.uiAmount;
        setMagicUsdcBalance(convertedUsdcBalance);
      } catch (error) {
        console.log('error: ', error)
      }

    }

    
    getBalance(publicKey);
    getUsdcBalance(publicKey);
    (async () => {
      // check local storage for store_owner_array, if it does not exist then create it
      if (localStorage.getItem("store_owner_array") === null) {
        localStorage.setItem("store_owner_array", JSON.stringify([]));
      }
      // check local storage for active_store, if it does not exist then create it
      if (localStorage.getItem("active_store") === null) {
        localStorage.setItem("active_store", JSON.stringify());
      }
      const store = await getCollectionOwner(publicKey);
      if (store.collections.length) {
        const store_symbols = store.collections.map((item) => item.symbol);

        const store_selection = store_symbols;
        setMultiStoreArray(store.collections);
        setCurrentStore(store.collections[0]);
        // console.log('new multiStoreArray: ', multiStoreArray);
        localStorage.setItem(
          "store_owner_array",
          JSON.stringify(store_symbols)
        );
        localStorage.setItem("active_store", JSON.stringify(store_symbols[0]));
        setIsMultiStoreOwner(true);
      }
    })();

    const getData = async () => {
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
      const data = await CheckForCollectionByOwner(publicKey.toString());
      console.log('data', data)
      if(data){
        setMerchant(true);
      }
    };
    getData();
    }
  }, [publicKey, merchant]);

  useEffect(() => {
    async function getBalance(pubKey) {

      const balance = await connection.getBalance(pubKey);
      console.log('balance: ', balance)
      const convertedBalance = balance / 1000000000;
      setMagicBalance(convertedBalance);
    }

    async function getUsdcBalance(pubKey) {
      const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
      try{
        const associatedTokenAddress = await getAssociatedTokenAddress(usdcAddress, pubKey);
        console.log('associatedTokenAddress: ', associatedTokenAddress.toString())
        const usdcBalance = await connection.getTokenAccountBalance(associatedTokenAddress);
        console.log('usdcBalance: ', usdcBalance.value.uiAmount)
        const convertedUsdcBalance = usdcBalance.value.uiAmount;
        setMagicUsdcBalance(convertedUsdcBalance);
      } catch (error) {
        console.log('error: ', error)
      }

    }

    if (window) {
      window.addEventListener("magic-logged-in", () => {
        console.log('event listener fired')
        const data = localStorage.getItem("userMagicMetadata");
        if (data) {
          const parsedData = JSON.parse(data);
          console.log('parsedData: ', parsedData)
          const publicKey = new web3.PublicKey(parsedData.publicAddress);
          getBalance(publicKey)
          getUsdcBalance(publicKey)
          console.log('publicKey: ', publicKey.toString())
          setMagicMetadata(parsedData);
          setMagicPublicKey(publicKey.toString());
          setMagicUser(true);
          const getData = async () => {
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
            const data = await CheckForCollectionByOwner(publicKey.toString());
            console.log('data', data)
            if(data){
              setMerchant(true);
            }
          };
          getData();

        }
        else {
          setMagicUser(false);
        }
      });
      window.addEventListener("magic-logged-out", () => {
        setMagicMetadata("");
        setMagicPublicKey("");
        setMagicUser(false);
      });
      window.addEventListener("closeQuickActions", () => {
        setShowQuickActions(false);
      });
      
    }
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" style={{display:"flex", flexDirection:"row"}} className={styles.navbar}>
        <Container className={styles.navbar_container}>
              <Navbar.Brand onClick={() => router.push("/")} className={styles.navbar_brand}>
                {showQuickActions && (
                  renderMagicQuickActions()
                )}
                <img
                  src="/newlogo.png"
                  style={{ cursor: "pointer", maxWidth: "160px"}}
                  className="logo_header"
                />
              </Navbar.Brand>
              <Navbar.Toggle style={{ color: "#000", position:"absolute", top:"10px", right:"10px"}} aria-controls="basic-navbar-nav">
                <FontAwesomeIcon icon={faBars}  />
              </Navbar.Toggle>
              <Navbar.Collapse
                id="basic-navbar-nav"
                className={styles.navbar_collapse}
              >
                {/* DYNAMIC PATH RENDER HERE FOR MERCHANT DASHBOARD*/}
                {currentPath === "/merchant/dashboard" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <div className="wave">
                        <img src="/wave.png" />
                        <p>
                          Hello Wallet: <strong>{magicPublicKey && magicPublicKey.slice(0, 4)}...{magicPublicKey && magicPublicKey.slice(-4)}</strong>
                        </p>
                        <div className="wallet_amount">
                          <div className="sol">
                            <img src="/sol.png" />
                            {/* truncate magicBalance to the 2nd decimal */}
                            <p>{magicBalance && magicBalance.toFixed(2)} SOL</p>
                          </div>
                          <div className="usdc">
                            <img src="/usdc.png" />
                            <p>{magicUsdcBalance && magicUsdcBalance.toFixed(2)} USDC</p>
                          </div>
                        </div>
                      </div>

                      {/* ******TOGGLE DASHBOARD********** */}
                      <Nav.Link className="menu_link" style={{ marginLeft: "20px",border: "none" }}>
                        
                        <div id="container">
                          
                          <div 
                            onClick={()=> router.push("/user/dashboard")}
                            
                            id="target" 
                            class="sun"
                            
                          > 
                            <IoStorefrontOutline className="sunny_tog" />
                      
                          </div>
             
               
                        </div>
                      </Nav.Link>

                      <Nav.Link className="menu_link" style={{ marginLeft: "20px",border: "none" }}>
                        <div id="container">
                          {theme === "light" && (
                          <div 
                            onClick={toggleTheme}
                            id="target" 
                            class="sun"
                            
                          > 
                            <IoSunnyOutline className="sunny_tog" />
                            <div></div>
                          </div>
                          )}
                          {theme === "dark" && (
                            <div 
                              onClick={()=> router.push("/merchant/dashboard")}
                              id="target" 
                              class="moon"
                            > 
                              {theme === "dark" && (
                                <IoMoonOutline className="moon_tog" />
                              )}
                            
                              <div></div>
                            </div>
                          )}
                        </div>
                      </Nav.Link>
                    {!publicKey && magicUser &&(
                      <Nav.Link
                        // setShowQuickActions(true);
                        onClick={()=> setShowQuickActions(true)}
                        className={styles.navbar_link}
                      >
                        <IoWalletOutline />
                      </Nav.Link>
                    )}
                    {!publicKey && (
                      renderMagicLogin()
                    )}
                    {publicKey && (
                      <WalletMultiButton />
                    )}
                    </div>
                  </div>
                )}
                {currentPath === "/user/dashboard" && (
                  <div
                    className={styles.multi_display}
                  >
                    <div
                      className={styles.wallet_display}
                    >
                      <div className="wave">
                        <img src="/wave.png" />
                        <p>
                          Hello Wallet: <strong>{magicPublicKey && magicPublicKey.slice(0, 4)}...{magicPublicKey && magicPublicKey.slice(-4)}</strong>
                        </p>
                      </div>

                      <div className="wallet_amount">
                        <div className="sol">
                          <img src="/sol.png" />
                          <p>{magicBalance && magicBalance.toFixed(2)} SOL</p>
                        </div>
                        <div className="usdc">
                          <img src="/usdc.png" />
                          <p>{magicUsdcBalance && magicUsdcBalance.toFixed(2)} USDC</p>
                        </div>
                      </div>
                    </div>

                    {/* ******TOGGLE DASHBOARD********** */}
                    <Nav.Link className="menu_link" style={{ marginLeft: "20px",border: "none" }}>
                        <div id="container">
                          
                            <div 
                              onClick={()=> router.push("/merchant/dashboard")}
                              id="target" 
                              class="moon"
                            > 
                    
                                <IoAccessibilityOutline className="moon_tog" />
                              
                            
                   
                            </div>
                     
                        </div>
                      </Nav.Link>
                    
                    {/* TOGGLE FOR LIGHT MODE AND DARK MODE */}
                    <Nav.Link className="menu_link" style={{ border: "none" }}>
                      <div id="container">
                        {theme === "light" && (
                        <div 
                          onClick={toggleTheme}
                          id="target" 
                          class="sun"
                        > 
                          <IoSunnyOutline className="sunny_tog" />
                          <div></div>
                        </div>
                        )}
                        {theme === "dark" && (
                          <div 
                            onClick={toggleTheme}
                            id="target" 
                            class="moon"
                          > 
                            {theme === "dark" && (
                              <IoMoonOutline className="moon_tog" />
                            )}
                          
                            <div></div>
                          </div>
                        )}
                      </div>
                    </Nav.Link>
                    {!publicKey && magicUser &&(
                      <Nav.Link
                        // setShowQuickActions(true);
                        onClick={()=> setShowQuickActions(true)}
                        className={styles.navbar_link}
                      >
                        <IoWalletOutline />
                      </Nav.Link>
                    )}
                    {!publicKey && (
                      renderMagicLogin()
                    )}
                    {publicKey && (
                      <WalletMultiButton />
                    )}
                  </div>
                )}
                <Nav
                  style={{
                    
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {currentPath != "/user/dashboard" && currentPath != "/merchant/dashboard" && (
                  <div
                    className={styles.wallet_display}
                  >
                    <Nav.Link
                      href="/user/dashboard"
                      className="menu_link nav-link nav-link-fade-up"
                      style={{ border: "none" }}
                    >
                      Dashboard
                    </Nav.Link>
                    <Nav.Link
                      href="https://forms.gle/Hufp94teN3h1QdAw5"
                      className="menu_link nav-link nav-link-fade-up"
                      style={{ border: "none" }}
                    >
                      Apply Now
                    </Nav.Link>
                    <Nav.Link
                      href="https://ikons.io"
                      className="menu_link nav-link nav-link-fade-up"
                      style={{ border: "none" }}
                    >
                      NFT
                    </Nav.Link>
                    <div className={styles.social_links}>
                      <Nav.Link
                        href="https://twitter.com/IkonShopApp"
                        className="menu_link"
                        style={{ border: "none" }}
                      >
                        <LogoTwitter />
                      </Nav.Link>

                      <Nav.Link
                        href="https://discord.gg/ikons"
                        className="menu_link"
                        style={{ border: "none" }}
                      >
                        <LogoDiscord />
                      </Nav.Link>
                    </div>
                    {!publicKey && magicUser &&(
                      <Nav.Link
                        // setShowQuickActions(true);
                        onClick={()=> setShowQuickActions(true)}
                        className={styles.navbar_link}
                      >
                        <IoWalletOutline />
                      </Nav.Link>
                    )}
                    {/* if page is not /register then display  */}
                    {/* IF LOGGED IN WITH MAGIC THEN HIDE WALLET MULTI BUTTON */}
                    {currentPath !== "/register" && (
                      <>
                        {!magicUser && (
                          <Nav.Link>
                            <WalletMultiButton className="disconnect-button wallet_button" />
                          </Nav.Link>
                        )}
                        {!publicKey && (
                          renderMagicLogin()
                        )}
                      </>
                    )}
                    {currentPath === "/register" && (
                      <>
                        
                        {!publicKey && magicUser && (
                          renderMagicLogin()
                        )}
                        
                      </>
                    )}
                  </div>
                  )}
           
                </Nav>
              </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}
