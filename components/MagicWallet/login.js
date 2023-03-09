import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";
import { CreateCollectionFromMagic, GetCollectionByEmail } from "../../lib/api";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import Loading from "../Loading";
import { 
  IoPersonCircle,
  IoLogIn
} from "react-icons/io5";

const rpcUrl =
  "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

const LoginMagic = (req) => {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [balance, setBalance] = useState(0);
  const [magicUsdcBalance, setMagicUsdcBalance] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const connection = new web3.Connection(rpcUrl);

  const login = async (e) => {
    e.preventDefault();
    console.log("starting login for email", email);
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
      extensions: {
        solana: new SolanaExtension({
          rpcUrl,
        }),
      },
    });
    await magic.auth.loginWithMagicLink({ email });
    const userMetadata = await magic.user.getMetadata();
    localStorage.setItem("userMagicMetadata", JSON.stringify(userMetadata));
    const pubFromMetadata = new web3.PublicKey(userMetadata.publicAddress);
    getBalance(pubFromMetadata);
    getUsdcBalance(pubFromMetadata);
    window.dispatchEvent(new Event("magic-logged-in"));
    setIsLoggedIn(true);
  };

  const logout = async (e) => {
    e.preventDefault();
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
      extensions: {
        solana: new SolanaExtension({
          rpcUrl,
        }),
      },
    });
    await magic.user.logout();
    localStorage.removeItem("userMagicMetadata");
    window.dispatchEvent(new Event("magic-logged-out"));
  };

  async function getBalance(pubKey) {
    const solanaMagicAddress = new web3.PublicKey(pubKey);
    const balance = await connection.getBalance(solanaMagicAddress);
    console.log("balance: ", balance);
    const convertedBalance = balance / 1000000000;
    setBalance(convertedBalance);
  }

  async function getUsdcBalance(pubKey) {
    const solanaMagicAddress = new web3.PublicKey(pubKey);
    console.log("checking for usdc balance", solanaMagicAddress.toString());
    const usdcAddress = new web3.PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcAddress,
        solanaMagicAddress
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
      setMagicUsdcBalance(convertedUsdcBalance);
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    setSendingTransaction(true);

    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
      extensions: {
        solana: new SolanaExtension({
          rpcUrl,
        }),
      },
    });
    const recipientPubKey = new web3.PublicKey(destinationAddress);
    const payer = new web3.PublicKey(userMetadata.publicAddress);

    const hash = await connection.getRecentBlockhash();

    let transactionMagic = new web3.Transaction({
      feePayer: payer,
      recentBlockhash: hash.blockhash,
    });

    const transaction = web3.SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipientPubKey,
      lamports: sendAmount,
    });

    transactionMagic.add(...[transaction]);

    const serializeConfig = {
      requireAllSignatures: false,
      verifySignatures: true,
    };

    const signedTransaction = await magic.solana.signTransaction(
      transactionMagic,
      serializeConfig
    );

    console.log("Signed transaction", signedTransaction);

    const tx = web3.Transaction.from(signedTransaction.rawTransaction);
    const signature = await connection.sendRawTransaction(tx.serialize());
    setTxHash(`https://explorer.solana.com/tx/${signature}`);
    setSendingTransaction(false);
  };

  const renderForm = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #000000",
          borderRadius: "10px",
          height: "57px",
          marginLeft: "10px",
        }}
      >
        <input
          type="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          name="email"
          required="required"
          placeholder={email ? email : "Enter Email"}
          style={{
            display: "flex",
            paddingLeft: "10px",
            border: "1px solid #000000",
            borderRadius: "10px",
            backgroundColor: "transparent",
            
            cursor: "pointer",
            border: "none"
          }}
        />
          <IoLogIn 
            onClick={login}
            style={{
              fontSize: "30px",
              color: "#130b46",
              cursor: "pointer",
              border: "none",
            }}
          />  
      </div>
    );
  };

  const renderLogout = () => {
    return (
      <>
        {isLoggedIn && (
          <form onSubmit={logout}>
            <button className="logout_button" type="submit" onClick={logout}>
              <IoPersonCircle
                style={{
                  fontSize: "30px",
                  color: "#130b46",
                }}
              />
              <span>{email}</span>
              <div class="tooltip">Logout</div>
            </button>
          </form>
        )}
      </>
    );
  };

  const renderEmailButton = () => {
    return (
      <button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#130b46",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          height: "45px"
        }}
        onClick={() => {
          setShowForm(true)
        }}
      >
        Login with Email
      </button>
    );
  };

  // useEffect to see if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
          solana: new SolanaExtension({
            rpcUrl,
          }),
        },
      });
      async function checkUser() {
        const loggedIn = await magic.user.isLoggedIn();
        console.log("loggedIn", loggedIn);
        if (loggedIn) {
          setIsLoggedIn(true);
          magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
            setIsLoggedIn(magicIsLoggedIn);
            if (magicIsLoggedIn) {
              magic.user.getMetadata().then((user) => {
                setUserMetadata(user);
                localStorage.setItem("userMagicMetadata", JSON.stringify(user));
                const pubKey = new web3.PublicKey(user.publicAddress);
                getBalance(pubKey);
                getUsdcBalance(pubKey);
                setEmail(user.email);
                window.dispatchEvent(new CustomEvent("magic-logged-in"));
              });
            }
          });
        }
      }

      checkUser();
    }
  }, []);

  useEffect(() => {
    console.log('req', req)
    if (req) {
      setEmail(req.req);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("magic-logged-out", () => {
      setIsLoggedIn(false);
      setUserMetadata(null);
      localStorage.removeItem("userMagicMetadata");
    });
  }, []);

  return (
    <div>
      {loading && <Loading />}
      {!isLoggedIn && !showForm && renderEmailButton()}
      {!loading && !isLoggedIn && showForm && renderForm()}
      {!loading && isLoggedIn && renderLogout()}
    </div>
  );
};

export default LoginMagic;
