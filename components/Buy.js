import React, { useEffect, useState, useMemo } from "react";
import { Keypair, Transaction, Connection } from "@solana/web3.js";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { findReference, FindReferenceError } from "@solana/pay";
import { useWallet } from "@solana/wallet-adapter-react";
import MagicButton from "./MagicWallet/buy";
import { createTransaction } from "./MagicWallet/buy"
// import IPFSDownload from "./IpfsDownload";
// import Green from '../components/Alert/Green';
// import Red from '../components/Alert/Red';
import {
  fetchItem,
  addOrder,
  deleteProductFromBuyer,
  getBuyerOrders,
  updateProductCounts,
  getSingleProductBySku,
} from "../lib/api";
// import { hasPurchased } from "../services/index";
import * as web3 from "@solana/web3.js";
import styles from "../styles/Product.module.css";
import Loading from "./Loading";
const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};

export default function Buy({
  id,
  owner,
  token,
  symbol,
  price,
  product,
  description,
  imageUrl,
  name,
}) {
  // console.log("this is the buy price", price);
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const { publicKey, sendTransaction } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState("");
  const [buyWithMagic, setBuyWithMagic] = useState(false);
  const orderID = useMemo(() => Keypair.generate().publicKey, []); // Public key used to identify the order
  const [orderComplete, setOrderComplete] = useState(false);
  const [tipJar, setTipJar] = useState(false);
  const [tipTokenType, setTipTokenType] = useState();
  const [tipAmount, setTipAmount] = useState();
  const [item, setItem] = useState(null); // IPFS hash & filename of the purchased item
  const [loading, setLoading] = useState(false); // Loading state of all above
  const [infoCaptured, setInfoCaptured] = useState(true); // Whether the info has been grabbed from the user
  const [shippingCaptured, setShippingCaptured] = useState(true); // Whether the shipping info has been grabbed from the user
  const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status

  const [showEmail, setShowEmail] = useState(false); // Whether to show the email input form
  const [email, setEmail] = useState(""); // Email address of the user

  const [showNote, setShowNote] = useState(false); // Whether to show the note input form
  const [note, setNote] = useState(""); // Note to the seller
  const [noteCaptured, setNoteCaptured] = useState(true); // Whether the note has been grabbed from the user

  const [showTwitter, setShowTwitter] = useState(false); // Whether to show the twitter input form
  const [twitter, setTwitter] = useState(""); // Twitter handle of the user
  const [twitterCaptured, setTwitterCaptured] = useState(true); // Whether the twitter handle has been grabbed from the user

  const [showDiscord, setShowDiscord] = useState(false); // Whether to show the discord input form
  const [discord, setDiscord] = useState(""); // Discord handle of the user
  const [discordCaptured, setDiscordCaptured] = useState(true); // Whether the discord handle has been grabbed from the user

  const [showColorOptions, setShowColorOptions] = useState(false); // Whether to show the color options input form
  const [colorOption, setColorOption] = useState(""); // Color option of the user

  const [showShipping, setShowShipping] = useState(false); // Whether to show the shipping input form
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    international: false,
  }); // Shipping address of the user
  const [shippingInfo, setShippingInfo] = useState(""); // Shipping info of the user in string form

  // Current Date and time
  const currentDateAndTime = new Date().toLocaleString();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentSecond = new Date().getSeconds();

  // concat all of date objects into year-month-day hour:minute:second
  const currentDateTime =
    currentYear +
    "-" +
    currentMonth +
    "-" +
    currentDay +
    " " +
    currentHour +
    ":" +
    currentMinute +
    ":" +
    currentSecond;
  // convert currentDateTime into ISO format
  const currentDateTimeISO = new Date(currentDateAndTime).toISOString();

  // Fetch the transaction object from the server (done to avoid tampering)
  const processTransaction = async () => {
    setLoading(true);
    if(!buyWithMagic) {
    console.log("sending this order", order);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const txData = await txResponse.json();
    // console.log("txData", txData);
    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    // console.log("Tx data is", tx);
    // console.log("here is the order man", order);
    // Attempt to send the transaction to the network
    try {
      // await sendTransaction and catch any error it returns

      const txHash = await sendTransaction(tx, connection);
      // Wait for the transaction to be confirmed

      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        <Red message="Transaction rejected by user" />;
      }
      if (error.code === -32603 || error.code === -32003) {
        <Red message="Transaction failed, probably due to one of the wallets not having this token" />;
      }
      if (error.code === -32000) {
        <Red message="Transaction failed" />;
      }
    } finally {
      setLoading(false);
    }
  } else {
    console.log('buying with magic')
    console.log("sending this order", order);
    const magic = new Magic("pk_live_FCF04103A9172B45", {
      extensions: {
      solana: new SolanaExtension({
          rpcUrl
      })
      }
    });
    const recipientPubKey = new web3.PublicKey(owner);
    const payer = new web3.PublicKey(userPublicKey);

    const hash = await connection.getRecentBlockhash();

    let transactionMagic = new web3.Transaction({
      feePayer: payer,
      recentBlockhash: hash.blockhash
    });

    const transaction = web3.SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipientPubKey,
   
    });

    transactionMagic.add(...[transaction]);

    const serializeConfig = {
      requireAllSignatures: false,
      verifySignatures: true
    };

    const signedTransaction = await magic.solana.signTransaction(
      transactionMagic,
      serializeConfig
    );

    console.log("Signed transaction", signedTransaction);

    const tx = web3.Transaction.from(signedTransaction.rawTransaction);
    const signature = await connection.sendRawTransaction(tx.serialize());
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);


    try {
      // await sendTransaction and catch any error it returns

      const txHash = await sendTransaction(tx, connection);
      // Wait for the transaction to be confirmed

      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`
      );
      setStatus(STATUS.Submitted);
    } catch (error) {
      console.error(error);
      if (error.code === 4001) {
        <Red message="Transaction rejected by user" />;
      }
      if (error.code === -32603 || error.code === -32003) {
        <Red message="Transaction failed, probably due to one of the wallets not having this token" />;
      }
      if (error.code === -32000) {
        <Red message="Transaction failed" />;
      }
    } finally {
      setLoading(false);
    }
  }
  };

  const order = useMemo(
    () => ({
      id: id,
      buyer: userPublicKey,
      orderID: orderID.toString(),
      // if product is a tip jar set the price to tip amount and set the token type to the tip jar token type
      product: product,
      price: tipJar ? tipAmount : price,
      token: tipJar ? tipTokenType : token,
      price: price,
      owner: owner,
      token: token,
      symbol: symbol,
      email: email,
      twitter: twitter,
      discord: discord,
      shippingInfo: shippingInfo,
      purchaseDate: currentDateTimeISO,
      note: note,
      colorOption: colorOption,
    }),
    [
      userPublicKey,
      orderID,
      owner,
      token,
      id,
      symbol,
      product,
      email,
      shippingInfo,
      twitter,
      discord,
      note,
      tipJar,
      tipTokenType,
      tipAmount,
      price,
      colorOption,
    ]
  );
  

  // render dropdown selection of color options and set selected color to colorOption
  const renderColorOptions = () => {
    const colorOptions = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "black",
      "white",
    ];
    return (
      <div>
        <label for="colorOptions">Select Color:</label>
        <select
          id="colorOptions"
          name="colorOptions"
          onChange={(e) => setColorOption(e.target.value)}
        >
          {colorOptions.map((color) => (
            <option value={color}>{color}</option>
          ))}
        </select>
      </div>
    );
  };

  // render form to capture user email
  const renderEmailForm = () => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const handleChange = (e) => {
      setEmail(e.target.value);
      // console.log("email", email);
    };
    return (
      <div className={styles.emailForm}>
        <label>Email</label>
        <div className={styles.input_field}>
          <input
            type="email"
            placeholder="jim@gmail.com"
            value={email}
            onChange={handleChange}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => {
            if (email !== "" && validRegex.test(email)) {
              setEmail(email);
              // console.log("Email captured", email);
              setShowEmail(false);
              setInfoCaptured(true);
            } else {
              alert("Please enter a valid email");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

  // render form to capture user shipping info
  const renderShippingForm = () => {
    return (
      <div className={styles.shippingForm}>
        <label style={{ marginBottom: "20px" }}>Shipping Address</label>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Name"
            value={shipping.name}
            onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          />
        </div>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Address"
            value={shipping.address}
            onChange={(e) =>
              setShipping({ ...shipping, address: e.target.value })
            }
          />
        </div>

        {/* <div className={styles.form_row}>
          <div className={styles.col_half}> */}
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="City"
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
          />
        </div>
        {/* </div> */}
        {/* <div className={styles.col_half}> */}
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Zip"
            value={shipping.zip}
            onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
          />
        </div>
        {/* </div>
        </div> */}
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="State"
            value={shipping.state}
            onChange={(e) =>
              setShipping({ ...shipping, state: e.target.value })
            }
          />
        </div>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Country"
            value={shipping.country}
            onChange={(e) =>
              setShipping({ ...shipping, country: e.target.value })
            }
          />
        </div>
        {/* checkbox for if shipping internationally */}
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="international"
            name="international"
            value="international"
            onChange={(e) =>
              setShipping({ ...shipping, international: e.target.checked })
            }
          />
          <label htmlFor="international">International? (+.25 SOL)</label>
        </div>

        <button
          className={styles.saveBtn}
          onClick={() => {
            if (
              shipping.name !== "" &&
              shipping.address !== "" &&
              shipping.city !== "" &&
              shipping.state !== "" &&
              shipping.zip !== "" &&
              shipping.country !== ""
            ) {
              setShipping(shipping);
              // console.log("Shipping info captured", shipping);
              setShowShipping(false);
              setShippingCaptured(true);
              // setShippingInfo as a string of only the values from the shipping not the key's
              setShippingInfo(
                `${shipping.name}, ${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.country}, ${shipping.zip}, ${shipping.international}`
              );

              // console.log("Shipping info,", shippingInfo);
            } else {
              alert("Please fill out all shipping fields");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

  const renderNoteForm = () => {
    return (
      <div className={styles.noteForm}>
        <label style={{ marginBottom: "20px" }}>Note to Seller</label>
        <div className={styles.input_field}>
          <input
            type="text"
            placeholder="Note to Seller"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => {
            if (note !== "") {
              setNote(note);
              // console.log("Note captured", note);
              setShowNote(false);
              setNoteCaptured(true);
            } else {
              alert("Please enter a note to seller");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

  // render form to capture user twitter handle
  const renderTwitterForm = () => {
    return (
      <div className={styles.twitterForm}>
        <label>Twitter Handle</label>
        <div className={styles.input_field}>
          <input
            tabIndex={showEmail || showShipping || showTwitter ? "0" : "-1"}
            type="text"
            placeholder="@TopShotTurtles"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => {
            if (twitter !== "") {
              setTwitter(twitter);
              // console.log("Twitter handle captured", twitter);
              setShowTwitter(false);
              setTwitterCaptured(true);
            } else {
              alert("Please enter a valid twitter handle");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

  // render form to capture user discord id
  const renderDiscordForm = () => {
    return (
      <div className={styles.discordForm}>
        <label>Discord ID</label>
        <div className={styles.input_field}>
          <input
            tabIndex={
              showEmail || showShipping || showTwitter || showDiscord
                ? "0"
                : "-1"
            }
            type="text"
            placeholder="User#1234"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={() => {
            if (discord !== "") {
              setDiscord(discord);
              // console.log("Discord ID captured", discord);
              setShowDiscord(false);
              setDiscordCaptured(true);
            } else {
              alert("Please enter a valid discord ID");
            }
          }}
        >
          Save
        </button>
      </div>
    );
  };

 

  useEffect(() => {
    if(!publicKey){
      //check local storage for userMagicMetadata get the public address and convert it to publicKey and set it
      const userMagicMetadata = localStorage.getItem("userMagicMetadata");
      console.log("userMagicMetadata", userMagicMetadata)
      setBuyWithMagic(true);
      if (userMagicMetadata) {
        const userMagicMetadataObj = JSON.parse(userMagicMetadata);
        const userPublicAddress = userMagicMetadataObj.publicAddress;
        const userPublicKeyObj = new web3.PublicKey(userPublicAddress);
        setUserPublicKey(userPublicKeyObj.toString());
        console.log("userPublicKeyObj", userPublicKeyObj.toString());
      }
    } else {
      setUserPublicKey(publicKey.toString());
    }

  }, [])

  return (
    <div>
      {/* Display either buy button or IPFSDownload component based on if Hash exists */}
      {showEmail ? renderEmailForm() : null}
      {showTwitter ? renderTwitterForm() : null}
      {showDiscord ? renderDiscordForm() : null}
      {showShipping ? renderShippingForm() : null}
      {showColorOptions ? renderColorOptions() : null}
      {showNote ? renderNoteForm() : null}
      {showNote && noteCaptured ? (
        <div className={styles.note}>
          <p>Note to Seller: {note}</p>
        </div>
      ) : null}
      {showTwitter && twitterCaptured ? (
        <p>Twitter Captured: {twitter}</p>
      ) : null}
      {showDiscord && discordCaptured ? (
        <p>Discord Captured: {discord}</p>
      ) : null}
      {infoCaptured && email ? <p>Email Captured: {email}</p> : null}
      {infoCaptured && shipping ? (
        <p>
          {shipping.name} {shipping.address} {shipping.city} {shipping.state}{" "}
          {shipping.country} {shipping.zip}{" "}
          {shipping.international ? shipping.international : null}
        </p>
      ) : null}
      {!buyWithMagic && item && infoCaptured ? (
        <>
          {!buyWithMagic && item.product.type != "tipjar" ? (
            <>
              <h3 className="purchased">Purchase Complete!</h3>

              <button
                disabled={loading || !infoCaptured || !shippingCaptured}
                className="buy-button"
                onClick={processTransaction}
              >
                Buy Again
              </button>
            </>
          ) : (
            <>
              <button
                disabled={loading || !infoCaptured || !shippingCaptured}
                className="buy-button"
                onClick={processTransaction}
              >
                Send Tip
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {!buyWithMagic && tipJar && shippingCaptured ? (
      
              <button
                disabled={loading || !infoCaptured || !shippingCaptured}
                className="buy-button"
                onClick={processTransaction}
              >
                Send Tip
              </button>
          
          ) : (
            null
          )}
            {!buyWithMagic && !tipJar && shippingCaptured && infoCaptured ? (
              <button
              disabled={loading || !infoCaptured || !shippingCaptured}
              className="buy-button"
              onClick={processTransaction}
            >
              Pay Now
            </button>
          ): null}

          {buyWithMagic && <MagicButton order={order} />}
        </>
      )}
    </div>
  );
}
