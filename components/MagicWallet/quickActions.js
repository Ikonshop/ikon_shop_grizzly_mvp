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

const QuickActions = (req) => {
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
  const connection = new web3.Connection(
    web3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );
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
          <p>Token: </p>
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
    //will need to create a modal that displays the qr code
    return (
      <div className={styles.depositContainer}>
        <div id="qr-code"></div>
        <div className={styles.transferInputTokenRow}>
          <p>Token: </p>
          <div className={styles.tokenSelect}>
            <select onChange={(e) => setTokenType(e.target.value)}>
              <option value="USDC">USDC</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
        </div>
        <div className={styles.transferInputRow}>
          <h4>Address: </h4>
          <span>Address: </span>
          {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          {copied ? <IoCheckmark className={styles.copyIconCheck} /> : null}
          {!copied && (
            <IoCopyOutline
              className={styles.copyIcon}
              onClick={() => handleCopy(publicKey)}
            />
          )}
        </div>
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
              <p>{req.magicBalance.toFixed(4)} SOL</p>
            </div>

            <div className={styles.balance}>
              <img src="/usdc.png" />
              <p>{req.magicUsdcBalance} USDC</p>
            </div>
          </div>
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
                <button className="signup_button">Transfer</button>
              ) : (
                ""
              )}
            </div>

            <div
              className={styles.displayOptionsText}
              onClick={() => {
                setDisplayQR(!displayQR);
                setDisplayTransfer(false);
              }}
            >
              {!displayQR ? (
                <button className="dep_button_sec">Deposit</button>
              ) : (
                ""
              )}
            </div>
          </div>
          {displayQR && tokenType === "SOL" && renderDepositQR()}
          {displayQR && tokenType === "USDC" && renderDepositQRUsdc()}
          {!displayQR && (
            <div className={styles.transferContainer}>
              {displayTransfer && (
                <>
                  <br />
                  <br />
                  <div className={styles.transferInputRow}>
                    <input
                      className={styles.transferInput}
                      placeholder="Enter Address"
                      onChange={(e) => setTransferToAddress(e.target.value)}
                    ></input>
                  </div>
                  <div className={styles.transferInputRow}>
                    <input
                      className={styles.transferInput}
                      placeholder="Amount"
                      onChange={(e) => setTransferAmount(e.target.value)}
                    ></input>
                    {/* <div
                                            className={styles.transferMax}
                                            onClick={() => setTransferAmount(req.magicBalance - 0.001)}
                                        >
                                            Set Max
                                        </div> */}
                  </div>
                  <div className={styles.tokenSelect}>
                    <select onChange={(e) => setTokenType(e.target.value)}>
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
                      <span>Recipient:</span> {transferToAddress}
                    </div>
                    <div className={styles.detailRow}>
                      <span>Gas:</span> 0.0001 SOL
                    </div>
                    <div className={styles.detailRow}>
                      <span>Total:</span> {transferAmount + 0.0001}
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
