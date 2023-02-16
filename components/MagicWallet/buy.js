import React , { useState, useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as web3 from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { gql, GraphQLClient } from 'graphql-request';
import { addBuyAllOrder,   getSingleProductBySku } from '../../lib/api';
import base58 from 'bs58'
import Loading from '../Loading';
import styles from "../../styles/Product.module.css";
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';


const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
const connection = new web3.Connection(rpcUrl, "confirmed");
const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = web3.Keypair.fromSecretKey(base58.decode(shopSecretKey));
const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
// SPL TOKEN ADDRESS
const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const dustAddress = new web3.PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ");
const gmtAddress = new web3.PublicKey("7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx");
const goreAddress = new web3.PublicKey("6wJYjYRtEMVsGXKzTuhLmWt6hfHX8qCa6VXn4E4nGoyj");
const peskyAddress = new web3.PublicKey("nooot44pqeM88dcU8XpbexrmHjK7PapV2qEVnQ9LJ14");
const creckAddress = new web3.PublicKey("Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY");
const groarAddress = new web3.PublicKey("GroARooBMki2hcpLP6QxEAgwyNgW1zwiJf8x1TfTVkPa");
const forgeAddress = new web3.PublicKey("FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds");
const rainAddress = new web3.PublicKey("rainH85N1vCoerCi4cQ3w6mCf7oYUdrsTFtFzpaRwjL");
const foxyAddress = new web3.PublicKey("FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq");

// ******************MAGIC

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};



const MagicButton = (req) => {
  const orderID = useMemo(() => web3.Keypair.generate().publicKey, []);
  const [loading, setLoading] = useState(false);
  const [userPublicKey, setUserPublicKey] = useState("");
  const [userEmail, setUserEmail] = useState("");
  console.log('reqs are: ', req)
  const id = req.id
  // DETAILS NEEDED FOR ORDER
  const [tipJar, setTipJar] = useState(false);
  const [tipTokenType, setTipTokenType] = useState();
  const [tipAmount, setTipAmount] = useState();
  const [item, setItem] = useState(null); // IPFS hash & filename of the purchased item
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

  const order = useMemo(
    () => ({
      id: req.order.product.id,
      buyer: userPublicKey,
      orderID: orderID.toString(),
      // if product is a tip jar set the price to tip amount and set the token type to the tip jar token type
      product: req.order.product,
      price: tipJar ? tipAmount : req.order.product.price,
      token: tipJar ? tipTokenType : req.order.product.token,
      email: email,
      twitter: twitter,
      discord: discord,
      shippingInfo: shippingInfo,
      note: note,
      colorOption: colorOption,
    }),
    [
      userPublicKey,
      orderID,
      req.order.product.token,
      id,
      req.order.product,
      email,
      shippingInfo,
      twitter,
      discord,
      note,
      tipJar,
      tipTokenType,
      tipAmount,
      req.order.productprice,
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


  const createAndSendTransaction = async () => {
    try{
      setLoading(true);
      const graphQLClient = new GraphQLClient((graphqlAPI), {
        headers: {
          authorization: `Bearer ${GRAPHCMS_TOKEN}`,
        },
      });
      console.log("req on txn", req);
      if (!req.order.buyer) {
        res.status(400).json({
          message: "Missing buyer address",
        });
      }
      if (!orderID) {
        res.status(400).json({
          message: "Missing order ID",
        });
      }
      var tokenType = req.order.token
      const id = req.order.id;
      const buyerAddy = req.order.buyer;
      const owner = req.order.owner;
      var itemPrice = req.order.price;

      console.log("TOKEN TYPE IS THIS!!!", tokenType);
      // const { publicKey, signTransaction }= useWallet();
  
      const sellerAddress = owner;
      console.log("SELLER ADDRESS IS THIS!!!", sellerAddress);
      const sellerPublicKey = new web3.PublicKey(sellerAddress);
      console.log("SELLER PUBLIC KEY IS THIS!!!", sellerPublicKey);
      const email = req.order.email;
      const shippingInfo = req.order.shippingInfo;
      // grab the last word in the shippingInfo string (true or false) and set it to intl
      const international = shippingInfo.split(" ").pop();
  
      console.log("INTERNATIONAL IS THIS!!!", international); 
  
      var query = gql`
      query GetProduct($id: ID!) {
        product(where: {id: $id}) {
          token
          price
          type
        }
      }
      `;
      const result = await graphQLClient.request(query, 
        {
          id: id
        });
  
      console.log("RESULT IS THIS!!!", result);
      
      
      
      const type = result.product.type;
  
  
      // if result.product.type === "tipjar" then use req.order.token
      if(type !== "tipjar") {
        console.log("TYPE IS NOT TIPJAR");
        var tokenType = result.product.token;
        var itemPrice = result.product.price;
      }
  
  
      // for(var i = 0; i < result.length; i++) {
      //   console.log('result', result[i]);
      //   if(result.product.type === "tipjar"  ) {
      //     var tokenType = req.order.token;
      //     const itemPrice = req.order.price;
      //   }else{
      //     var tokenType = result.product.token;
      //     const itemPrice = result.product.price;
      //   }
      // }
      console.log("TOKEN TYPE IS THIS!!!", tokenType);
  
  
      const itemTokenType = tokenType;
      console.log("tipjar", tokenType);
      
      
      // const itemPrice = "1"
      console.log("itemPrice", itemPrice);
      if (!itemPrice) {
        res.status(404).json({
          message: "Item not found. please check item ID",
        });
      }
  
      const bigAmount = BigNumber(itemPrice);
      const buyerPublicKey = new web3.PublicKey(buyerAddy);
      console.log('buyerPublicKey', buyerPublicKey.toString());

      const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
            solana: new SolanaExtension({
            rpcUrl
            })
        }
      });
      const userMetadata = await magic.user.getMetadata();
      const payer = new web3.PublicKey(userMetadata.publicAddress);
      // https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7
      
      const hash = await connection.getRecentBlockhash();
 

      // const endpoint = web3.clusterApiUrl(network);
      // const block_connection = new web3.Connection(endpoint, "confirmed");
      // const network = WalletAdapterNetwork.Devnet;

      // const endpoint = web3.clusterApiUrl(network);
      // const block_connection = new web3.Connection(endpoint, "confirmed");
      // const { blockhash } = await block_connection.getLatestBlockhash("finalized");
      console.log('payer', payer.toString())
      let transactionMagic = new web3.Transaction({
        feePayer: payer,
        recentBlockhash: hash.blockhash
      });

      // ******************SOL TRANSACTION
      if(itemTokenType === "sol") {
        const transaction = web3.SystemProgram.transfer({
          fromPubkey: buyerPublicKey,
          // Lamports are the smallest unit of SOL, like Gwei with Ethereum
          lamports: bigAmount.multipliedBy(1000000000).toNumber(), 
          toPubkey: sellerPublicKey,
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
        console.log(`https://explorer.solana.com/tx/${signature}`);
      }

      // ******************USDC TRANSACTION
      if(itemTokenType === "usdc") {
        const usdcMint = await getMint(connection, usdcAddress);
        const buyerUsdcAcc = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
        const shopUsdcAcc = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
        var buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
        var shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);

        // Merchant cut is bypassed, uncomment next line to set back to store addy
        // const secondUsdcAdress = await getAssociatedTokenAddress(usdcAddress, secondPublicKey);
        const secondUsdcAdress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
        
        console.log('checkin accounts')
        const checkAccounts = async() => {
          const buyerUsdcAccount = await connection.getAccountInfo(buyerUsdcAcc);
          if (buyerUsdcAccount === null) {
            console.log("buyer has no usdc account");
            const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, usdcAddress, buyerPublicKey);
            var buyerUsdcAddress = await newAccount.address;
            
    
          }else{
            var buyerUsdcAddress = await getAssociatedTokenAddress(usdcAddress, buyerPublicKey);
            // console.log("buyer has usd account", buyerUsdcAddress.toString());
    
          }
          // Check if the shop has a gore account
          const shopUsdcAccount = await connection.getAccountInfo(shopUsdcAcc);
          if (shopUsdcAccount === null) {
            console.log("shop has no gore account");
            const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, usdcAddress, sellerPublicKey);
            var shopUsdcAddress = await newAccount.address
            
          }
          else{
            var shopUsdcAddress = await getAssociatedTokenAddress(usdcAddress, sellerPublicKey);
          }

          return {buyerUsdcAddress, shopUsdcAddress}
        }
        
        await checkAccounts();

        const transaction = new web3.Transaction({
            fromPubkey: buyerPublicKey,
            toPubkey: sellerPublicKey,
        })

        const transferInstruction = createTransferCheckedInstruction(
          buyerUsdcAddress, 
          usdcAddress,     // This is the address of the token we want to transfer
          shopUsdcAddress, 
          buyerPublicKey, 
          ((bigAmount.toNumber() * 10 ** (await usdcMint).decimals)), 
          usdcMint.decimals // The token could have any number of decimals
        );

        var message = "Order for product: " + id;
        console.log("message", message);
        transferInstruction.keys.push({
          pubkey: new web3.PublicKey(orderID),
          isSigner: false,
          isWritable: false,
        });
        
        transactionMagic.add(...[transaction]);
        transactionMagic.add(...[transferInstruction]);

        transactionMagic.add(
                  new web3.TransactionInstruction({
                    keys: [
                      { pubkey: buyerPublicKey, isSigner: true, isWritable: false },
                      
                    ],
                    data: Buffer.from(message, "utf-8"),
                    programId: new web3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
                  })
                )

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
        // wait for transaction to be confirmed
        if(signature) {
          addBuyAllOrder(order)
        }
        console.log(`https://solana.fm/tx/${signature}`);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      console.log('error', error.message)
      // if error message is 'Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1'
      //alert('Transaction failed, due to insufficient funds.')
      if(error.message === 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1') {
        alert('Transaction failed, due to insufficient funds.')

      }else{
        alert('Transaction failed, please try again.')
      }
      setLoading(false);
    }
  };

  useEffect(() => {

      console.log("reqs", req);

      if (req.order.product) {
        console.log("reqs are", req);
        console.log("require email?", req.order.product.reqUserEmail);
        console.log("require shipping info?", req.order.product.reqUserShipping);
        if (req.order.product.reqTwitter === true) {
          setShowTwitter(true);
          setTwitterCaptured(false);
        }
        if (req.order.product.reqDiscord === true) {
          setShowDiscord(true);
          setDiscordCaptured(false);
        }
        if (req.order.product.reqUserEmail === false) {
          setInfoCaptured(true);
          if (reqs.product.reqUserShipping === false) {
            setShippingCaptured(true);
          }
          // console.log("", infoCaptured);
        }
        if (req.order.product.reqUserEmail === true) {
          setShowEmail(true);
        }
        if (req.order.product.reqUserShipping === true) {
          setShippingCaptured(false);
          setShowShipping(true);
        }
        if (req.order.product.reqColor === true) {
          setShowColorOptions(true);
        }
        if (req.order.product.reqNote === true) {
          setNoteCaptured(false);
          setShowNote(true);
        }
        if (req.order.product.type === "tipjar") {
          setTipJar(true);
        }
      }

  }, []);

  useEffect(() => {
      //check local storage for userMagicMetadata get the public address and convert it to publicKey and set it
      const userMagicMetadata = localStorage.getItem("userMagicMetadata");
      console.log("userMagicMetadata", userMagicMetadata)
      if (userMagicMetadata) {
        const userMagicMetadataObj = JSON.parse(userMagicMetadata);
        const userPublicAddress = userMagicMetadataObj.publicAddress;
        const userPublicKeyObj = new web3.PublicKey(userPublicAddress);
        setUserPublicKey(userPublicKeyObj.toString());
        setUserEmail(userMagicMetadataObj.email);
        setEmail(userMagicMetadataObj.email);
        console.log("userPublicKeyObj", userPublicKeyObj.toString());
      }

  }, [])

  return (
    <>
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
      <button
        onClick={() => createAndSendTransaction()}
        className="buy-button"
      >
        {!loading ? 'Pay w/ Magic' : 'Loading...'}
      </button>
    </>
    
  );
};

export default MagicButton;