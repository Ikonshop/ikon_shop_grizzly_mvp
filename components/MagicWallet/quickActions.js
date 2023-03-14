import React, { useState, useEffect, useMemo } from "react";
import Magic from "magic-sdk";
import styles from "./styles/QuickActions.module.css";
import * as web3 from "@solana/web3.js";
import {
  IoCopyOutline,
  IoTimeOutline,
  IoCheckmark,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { encodeURL, createQR } from "@solana/pay";
import Send from "./send";
import { getBalance, getUsdcBalance } from "../../hooks/getBalance";
import axios from "axios";

const QuickActions = (req) => {
  const [solBalance, setSolBalance] = useState(req.magicBalance);
  const [usdcBalance, setUsdcBalance] = useState(req.magicUsdcBalance);
  const [tokenSent, setTokenSent] = useState(false);

  const [copied, setCopied] = useState(false);
  const [displayQR, setDisplayQR] = useState(false);
  const [depositQR, setDepositQR] = useState(null);

  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [tokenType, setTokenType] = useState("SOL");
  const [displayTransfer, setDisplayTransfer] = useState(false);

  const pubKey = new web3.PublicKey(req.magicMetadata.publicAddress);
  const publicKey = pubKey.toString();
  const usdcAddress = new web3.PublicKey(
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  );
  // HELIUS API FOR BALANCE UPDATES****************
  const connection = new web3.Connection(`https://rpc.helius.xyz?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`);
  const url = `https://api.helius.xyz/v0/addresses/${publicKey}/balances?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`
  const getBalances = async () => {
    const { data } = await axios.get(url)
    console.log("balances: ", data)
    // returns {tokens: Array(1), nativeBalance: 20795000}
    //turn nativeBalance into SOL and setSolBalance
    setSolBalance(data.nativeBalance / 1000000000)
    // if tokens array is empty, setUsdcBalance to 0
    if (data.tokens.length === 0) {
      setUsdcBalance(0)
    }
    // if tokens array is not empty, find token with mint address of usdcAddress and setUsdcBalance to that token's balance
    if (data.tokens.length > 0) {
      const usdcToken = data.tokens.find(token => token.mint === usdcAddress.toString())
      setUsdcBalance(usdcToken.amount / 1000000)
    }
  }
  (async () => {
    try{
      connection.onAccountChange(
        new web3.PublicKey(publicKey),
        (updatedAccountInfo, context) =>
          console.log("Updated account info: ", updatedAccountInfo),
          getBalances(),
        "confirmed"
      );
    } catch (err) {
      console.log(err)
    }
  })();
  // *********************************************
  const handleCopy = (e) => {
    console.log(e);
    //copy to clipboard
    window.navigator.clipboard.writeText(e);
    setCopied(true);
  };

  const renderDepositQR = () => {
    const element = document.getElementById("qr-code");
    depositQR.append(element);
    return (
      <div className={styles.depositContainer}>
        <div id="qr-code"></div>
        <div className={styles.transferInputTokenRow}>
          <p>Token: {tokenType}</p>
          <div className={styles.tokenSelect}>
            <select onChange={(e) => setTokenType(e.target.value)}>
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>
        {/* <div className={styles.transferInputRow}>
          <h4>Address: </h4>
          <span>Address: </span> {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          {copied ? <IoCheckmark className={styles.copyIconCheck} /> : null}
          {!copied && (
            <IoCopyOutline
              className={styles.copyIcon}
              onClick={() => handleCopy(publicKey)}
            />
          )}
        </div> */}
      </div>
    );
  };

  const renderDepositQRUsdc = () => {
    const element = document.getElementById("qr-code");
    depositQR.append(element);
    return (
      <div className={styles.depositContainer}>
        <div id="qr-code"></div>
        <div className={styles.transferInputTokenRow}>
          <p>Token: {tokenType}</p>
          <div className={styles.tokenSelect}>
            <select onChange={(e) => setTokenType(e.target.value)}>
              <option value="USDC">USDC</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const refreshBalance = () => {
    getBalance(pubKey).then((balance) => {
      console.log("sol balance: ", balance);
      setSolBalance(balance);
    });
    getUsdcBalance(pubKey).then((balance) => {
      console.log("usdc balance: ", balance);
      setUsdcBalance(balance);
    });
  };

  const renderBalanceRefresh = () => {
    return (
      <div
        className={styles.balanceRefresh}
        onClick={() => {
          refreshBalance();
        }}
      >
        <p>
          <IoTimeOutline className={styles.balanceRefreshIcon} />
          Refresh Balance
        </p>
      </div>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (tokenType === "SOL") {
      const url = encodeURL({
        amount: 0,
        recipient: pubKey,
        message: "Magic Deposit on IkonShop",
      });
      // create a qr code with the url that is 200x200
      const newQr = createQR(url, 200);

      setDepositQR(newQr);
    } else if (tokenType === "USDC") {
      const url = encodeURL({
        amount: 0,
        recipient: pubKey,
        splToken: usdcAddress,
        message: "Magic Deposit on IkonShop",
      });
      // create a qr code with the url that is 200x200
      const newQr = createQR(url, 200);

      setDepositQR(newQr);
    }
  }, [tokenType]);

  useEffect(() => {
    refreshBalance();
    window.addEventListener("refreshBalance", () => {
      // refresh balance after 2 seconds
      console.log("refreshing balance");
      setTimeout(() => {
        refreshBalance();
      }, 8000);
    });
  }, []);

  return (
    <div className={styles.quickActionsOverlay}>
      <div className={styles.quickActions}>
        <div
          className={styles.closeButton}
          onClick={() =>
            window.dispatchEvent(new CustomEvent("closeQuickActions"))
          }
        >
          <IoCloseCircleOutline
            style={{
              fontSize: "32px",
            }}
          />
        </div>
        <div className={styles.leftContainer}>
          <div className={styles.addressContainer}>
            <div className={styles.address}>
              {/* for mobile, hide span and display h4 */}
              <h4>Address</h4>
              <p className={styles.address_bold_p}>Address:</p>
              <p>
                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </p>
            </div>
            {copied ? <IoCheckmark className={styles.copyIconCheck} /> : null}
            {!copied && (
              <IoCopyOutline
                className={styles.copyIcon}
                onClick={() => handleCopy(publicKey)}
              />
            )}
          </div>
          <div className={styles.emailContainer}>
            <div className={styles.email}>
              <h4>Email</h4>
              {/* for mobile hide span and display h4 */}
              <p className={styles.address_bold_p}>Email:</p>
              <p>{req.magicMetadata.email}</p>
            </div>
          </div>
          <div className={styles.balanceContainer}>
            <h4>Balance</h4>

            <div className={styles.balance}>
              <img src="/sol.png" />
              <p>{solBalance.toFixed(4)} SOL</p>
            </div>

            <div className={styles.balance}>
              <img src="/usdc.png" />
              <p>{usdcBalance} USDC</p>
            </div>
          </div>

          {renderBalanceRefresh()}
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.displayOptions}>
            <div
              className={styles.displayOptionsText}
              onClick={() => {
                setDisplayTransfer(!displayTransfer);
                setDisplayQR(false);
              }}
            >
              {!displayTransfer ? (
                <button className="signup_button">Send</button>
              ) : (
                ""
              )}
            </div>

            <div
              className={styles.displayOptionsText}
              onClick={() => {
                setTokenType("Select");
                setDisplayQR(!displayQR);
                setDisplayTransfer(false);
              }}
            >
              {!displayQR ? (
                <button
                  className="signup_button"
                  onClick={() => {
                    setDisplayQR(!displayQR);
                    setDisplayTransfer(false);
                  }}
                >
                  Receive
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          {displayQR && tokenType === "Select" && (
            <div className={styles.transferInputTokenRow}>
            <p>Token: {tokenType}</p>
            <div className={styles.tokenSelect}>
                <select onChange={(e) => setTokenType(e.target.value)}>
                  <option value="Select">Select</option>
                  <option value="SOL">SOL</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>
          )}
          {displayQR && tokenType === "SOL" && renderDepositQR()}
          {displayQR && tokenType === "USDC" && renderDepositQRUsdc()}
          {!displayQR && (
            <div className={styles.transferContainer}>
              {displayTransfer && (
                <>
                  <div className={styles.transferInputRow}>
                    <input
                      type="text"
                      className={styles.transferInput}
                      placeholder="Enter Address"
                      onChange={(e) => setTransferToAddress(e.target.value)}
                    ></input>
                  </div>
                  <div className={styles.transferInputRow}>
                    <input
                      // type is only postive numbers to the 2nd decimal
                      type="number"
                      step="0.01"
                      min="0"
                      className={styles.transferInput}
                      placeholder="Amount"
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <div className={styles.tokenSelect}>
                    <select onChange={(e) => setTokenType(e.target.value)}>
                      <option value="Select">Select</option>
                      <option value="SOL">SOL</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                  <Send
                    buyer={publicKey}
                    recipient={transferToAddress}
                    price={transferAmount}
                    token={tokenType}
                  />
                  <div className={styles.transferDetails}>
                    <h4>Recipient:</h4>
                    <div className={styles.detailRowAddress}>
                      <span>Recipient:</span> {transferToAddress.slice(0, 4)}
                      {transferToAddress ? "..." : null}
                      {transferToAddress.slice(-4)}
                    </div>
                    <div className={styles.detailRow}>
                      <span>Gas:</span> 0.0001 SOL
                    </div>
                    <div className={styles.detailRow}>
                      <span>Total:</span> {transferAmount} + Gas
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
