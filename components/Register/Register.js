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
  const [ikonNfts, setIkonNfts] = useState([]);
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
    const ikonCollectionAddress =
      "EgVDqrPZAiNCQdf7zC2Lj8CVTv25YSwQRF2k8aTmGEnM";
    const key = publicKey ? publicKey : new web3.PublicKey(userPubKey);
    var nfts = [];
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: key,
    });

    for (let i = 0; i < myNfts.length; i++) {
      if (
        myNfts[i].collection != null &&
        myNfts[i].collection.address.toString() === ikonCollectionAddress
      ) {
        nfts.push(myNfts[i]);
      }
    }

    console.log("myNfts", myNfts);
    console.log("ikon nfts", nfts);
    setIkonNfts(nfts);
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
    router.push("/merchant/dashboard?settings=true");
  };

  const handleUserRegister = async () => {
    const data = JSON.stringify({
      email: email,
      owner: userPubKey,
      name: userName,
    });

    const createUser = await UpsertWallet(data);
    console.log("createUser", createUser);
    router.push("/user/dashboard/?settings=true");
  };

  const handleLogin = async () => {
    const data = JSON.stringify({
      email: email,
      owner: userPubKey,
      storeName: storeName,
      name: userName,
    });
    const isCollectionOwner = await CheckForCollectionByOwner(
      publicKey.toString()
    );
    console.log("isCollectionOwner", isCollectionOwner);
    await checkForNfts();
    setConfirmRegister(true);
  };

  const renderConfirmRegister = () => {
    return (
      <div className={styles.register_modal}>
        <div className={styles.register_container}>
          <div className={styles.register_container_left}>
            <div className={styles.register_container_left_data}>
              <p>
                <span>
                  <IoPersonOutline />
                </span>{" "}
                {userName}
              </p>
              <p>
                <span>
                  <IoMailOutline />
                </span>{" "}
                {email}
              </p>
            </div>
          </div>
          <div className={styles.register_container_right}>
            <div className={styles.register_container_right_data}>
              <div className={styles.register_container_right_data_user}>
                <p>User</p>
                <p>
                  As a user, you can browse the marketplace, purchase products
                  from merchants, and create your own Tip Jar and Pay Request
                  links.
                </p>
                <button
                  className={styles.register_button}
                  onClick={() => handleUserRegister()}
                >
                  Register as User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (publicKey) {
      setUserPubKey(publicKey.toString());
      handleLogin();
    }
  }, [publicKey]);

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
                <p>{storeName != null ? storeName : null} -</p>
              </div>
            </div>

            <div className={styles.wallet_select}>
              <h3>
                Select a wallet you'll use to connect to your Dashboard and
                receive payments
              </h3>

              <div className={styles.register_wallet_buttons}>
                <div>
                  <LoginForm
                    userName={userName}
                    storeName={storeName}
                    email={email}
                  />
                  <p>Email wallet using Magic:</p>
                </div>

                <div>
                  <WalletMultiButton
                    className="signup_button2"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  />
                  <p>Browser wallet using Solana:</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
