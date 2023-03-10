import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles/Register.module.css";
import LoginForm from "../../components/MagicWallet/loginForm";
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

  const handleUserRegister = async () => {
    const data = JSON.stringify({
      email: email,
      owner: userPubKey,
      name: userName,
    });

    const createUser = await UpsertWallet(data);
    console.log("createUser", createUser);
    router.push("/dashboard/?userSettings=true");
  };

  useEffect(() => {
    if (publicKey) {
      setUserPubKey(publicKey.toString());
      handleUserRegister();
    }
  }, [publicKey]);

  useEffect(() => {
    window.addEventListener("magic-logged-in", () => {
      try{
      const userData = localStorage.getItem("userMagicMetadata");
      const user = JSON.parse(userData);
      console.log("user", user);
      const newPubKey = new web3.PublicKey(user.publicAddress);
      setUserPubKey(newPubKey.toString());
      handleUserRegister();
      }catch(e){
        console.log("error", e)
      }
    });
  }, []);

  return (
    <>

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
  
    </>
  );
};

export default Register;
