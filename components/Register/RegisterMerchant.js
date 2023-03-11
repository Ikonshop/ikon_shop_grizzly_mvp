import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles/Register.module.css";
import LoginForm from "../../components/MagicWallet/loginForm";
import Loading from "../../components/Loading";
import dynamic from "next/dynamic";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  CreateCollectionFromMagic,
  CheckForCollectionByOwner,
  UpsertWallet,
} from "../../lib/api";
import { useRouter } from "next/router";
import { Metaplex } from "@metaplex-foundation/js";
import * as web3 from "@solana/web3.js";
import { check } from "prettier";
import {
  IoMailOutline,
  IoPersonOutline,
  IoStorefrontOutline,
  IoWarningOutline,
} from "react-icons/io5";

const Register = (req) => {
  const router = useRouter();
  const { publicKey, disconnect } = useWallet();
  const [userPubKey, setUserPubKey] = useState(null);
  const [confirmRegister, setConfirmRegister] = useState(false);
  const [ikonNfts, setIkonNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = req.userName;
  const storeName = req.storeName;
  const email = req.email;
  console.log("userName", req.userName);
  console.log("storeName", req.storeName);
  console.log("email", req.email);
  const connection = new web3.Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const metaplex = new Metaplex(connection);
  const WalletMultiButton = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  // METAPLEX FUNCTIONS
  const checkForNfts = async () => {
    console.log("checking for nfts for ", userPubKey);
    const ikonCollectionAddress = "EgVDqrPZAiNCQdf7zC2Lj8CVTv25YSwQRF2k8aTmGEnM";
    const key = publicKey ? userPubKey : new web3.PublicKey(userPubKey);
    var nfts = [];
    // const myNfts = await metaplex.nfts().findAllByOwner({
    //   owner: key,
    // });

    // for (let i = 0; i < myNfts.length; i++) {
    //   if (
    //     myNfts[i].collection != null &&
    //     myNfts[i].collection.address.toString() === ikonCollectionAddress
    //   ) {
    //     nfts.push(myNfts[i]);
    //   }
    // }

    // not currently supported by solanaJS
    const axios = require("axios");
    (async() => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        jsonrpc: "2.0",
        id: 1,
        method: "qn_fetchNFTs",
        params: {
          wallet: userPubKey,
          omitFields: ["provenance", "traits"],
          page: 1,
          perPage: 10,
        },
      };
      console.log("data", data);
      try{
      const response = await axios.post(
        "https://newest-frequent-snowflake.solana-mainnet.discover.quiknode.pro/415e96b029506463ef9de79634982c3e1905d974/", 
        data,
        config
      )
      console.log("response", response);
      const myNfts = response.data.result.assets;
      for (let i = 0; i < myNfts.length; i++) {
        console.log("myNfts[i].collectionAddress", myNfts[i].collectionAddress, ikonCollectionAddress)
        if (
          myNfts[i].collectionAddress.toString() === ikonCollectionAddress
        ) {
          console.log('pushing nft', myNfts[i])
          nfts.push(myNfts[i]);
        }
      }

      console.log("myNfts", myNfts);
      console.log("ikon nfts", nfts);
      setIkonNfts(nfts);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  })();
  };

  const handleMerchantRegister = async () => {
    const data = JSON.stringify({
      email: email,
      owner: userPubKey,
      storeName: storeName,
      name: userName,
    });
    const createUser = await UpsertWallet(data);
    const isCollectionOwner = await CheckForCollectionByOwner(userPubKey);
    console.log("user created", createUser);
    console.log("isCollectionOwner", isCollectionOwner);
    if (!isCollectionOwner) {
      CreateCollectionFromMagic(data);
    }
    console.log("logged in and collection created");
    router.push("/dashboard?merchantSettings=true");
  };

  const handleLogin = async () => {
    const data = JSON.stringify({
      email: email,
      owner: userPubKey,
      storeName: storeName,
      name: userName,
    });
    const isCollectionOwner = await CheckForCollectionByOwner(
      userPubKey
    );
    console.log("isCollectionOwner", isCollectionOwner);
    await checkForNfts();
    setConfirmRegister(true);
  };

  const renderConfirmRegister = () => {
    return (
      <div className="signup_row1">
        <div className="">
          <div className={styles.current_info}>
            <div>
              <span>
                <IoPersonOutline />
              </span>{" "}
              <p>{userName}</p>
            </div>
            <div>
              <span>
                <IoMailOutline />
              </span>{" "}
              <p>{email}</p>
            </div>
            <div>
              <span>
                <IoStorefrontOutline />
              </span>{" "}
              <p>{storeName != null ? storeName : null} </p>
            </div>
          </div>

          <div className={styles.register_container_right_data_merchant}>
            {/* <p>Merchant</p>
                <p>
                  As a merchant, you can create your own digital storefront and
                  sell your products on the IkonShop marketplace.
                </p> */}
            <img className={styles.confetti} src="/confetti.gif" />
            {loading && <Loading />}
            {!loading && ikonNfts.length > 0 ? (
              <div className={styles.nftContainer}>
                <p>
                  Total Ikons: <strong>{ikonNfts.length}</strong>
                </p>
                <button
                  className="signup_button"
                  onClick={() => handleMerchantRegister()}
                >
                  Register as Merchant
                </button>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "30px",
                    }}
                  >
                    <IoWarningOutline
                      style={{
                        fontSize: "24px",
                        color: "#fcb901",
                      }}
                    />
                    <p
                      style={{
                        marginTop: "15px",
                      }}
                    >
                      You must own at least one <strong>Ikon NFT</strong> to
                      register as a merchant.
                    </p>
                  </div>
              </div>
            ) : (
              <div className={styles.nftContainer}>
                <p>
                  Total Ikons: <strong>{ikonNfts.length}</strong>
                </p>
                <button
                  className="signup_button"
                  onClick={() => handleMerchantRegister()}
                >
                  Register as Merchant
                </button>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "30px",
                    }}
                  >
                    <IoWarningOutline
                      style={{
                        fontSize: "24px",
                        color: "#fcb901",
                      }}
                    />
                    <p
                      style={{
                        marginTop: "15px",
                      }}
                    >
                      You must own at least one <strong>Ikon NFT</strong> to
                      register as a merchant... <br />
                      but since it's <strong>Grizzly Szn</strong> we've made an exception.
                    </p>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (publicKey) {
      console.log('handling login for', publicKey.toString())
      setUserPubKey(publicKey.toString());
    }
  }, [publicKey]);

  useEffect(() => {
    console.log('userPubKey', userPubKey)
    if(userPubKey != null){
      handleLogin();
    }
  }, [userPubKey]);

  useEffect(() => {
    window.addEventListener("magic-logged-in", () => {
      const userData = localStorage.getItem("userMagicMetadata");
      const user = JSON.parse(userData);
      console.log("user", user);
      const newPubKey = new web3.PublicKey(user.publicAddress);
      setUserPubKey(newPubKey.toString());
      setConfirmRegister(true);
    });
  }, []);

  return (
    <>
      {confirmRegister ? renderConfirmRegister() : null}
      {!confirmRegister && (
        <div className="signup_row1">
          <div className="">
            <div className={styles.current_info}>
              <div>
                <span>
                  <IoPersonOutline />
                </span>{" "}
                <p>{userName}</p>
              </div>
              <div>
                <span>
                  <IoMailOutline />
                </span>{" "}
                <p>{email}</p>
              </div>
              <div>
                <span>
                  <IoStorefrontOutline />
                </span>{" "}
                <p>{storeName != null ? storeName : null} </p>
              </div>
            </div>

            <div className={styles.wallet_select}>
              <h3>
                Select a wallet to connect to your Dashboard
              </h3>

              <div className={styles.register_wallet_buttons}>
         
                  <LoginForm
                    userName={userName}
                    storeName={storeName}
                    email={email}
                  />
                  <p>Email wallet using Magic</p>
       


                  <WalletMultiButton
                    className="signup_button2"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                  <p>Browser wallet using Solana</p>
  
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
