import React , { useState, useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as web3 from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import base58 from 'bs58'
import Loading from '../Loading';
import styles from "./styles/SendButton.module.css";
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';
import Notification from "../Notification/Notification";
import { addOrder } from "../../lib/api";


const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
const connection = new web3.Connection(rpcUrl, "confirmed");

// SPL TOKEN ADDRESS
const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
// ******************MAGIC

const STATUS = {
  Initial: "Initial",
  Submitted: "Submitted",
  Paid: "Paid",
};



const Send = (
  req
) => {
    console.log('sending', req)
    
    const orderID = useMemo(() => web3.Keypair.generate().publicKey, []);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [tipJar, setTipJar] = useState(false);
    const [tipTokenType, setTipTokenType] = useState();
    const [tipAmount, setTipAmount] = useState();
    const [item, setItem] = useState(null); // IPFS hash & filename of the purchased item
    const [infoCaptured, setInfoCaptured] = useState(true); // Whether the info has been grabbed from the user
    const [shippingCaptured, setShippingCaptured] = useState(true); // Whether the shipping info has been grabbed from the user
    const [status, setStatus] = useState(STATUS.Initial); // Tracking transaction status
  
    const [showEmail, setShowEmail] = useState(false); // Whether to show the email input form
    const [email, setEmail] = useState(req.email ? req.email : ""); // Email address of the user
  
    const [showNote, setShowNote] = useState(false); // Whether to show the note input form
    const [note, setNote] = useState(req.note ? req.note : null); // Note to the seller
    const [noteCaptured, setNoteCaptured] = useState(true); // Whether the note has been grabbed from the user
  
    const [showTwitter, setShowTwitter] = useState(false); // Whether to show the twitter input form
    const [twitter, setTwitter] = useState(req.twitter ? req.twitter : ""); // Twitter handle of the user
    const [twitterCaptured, setTwitterCaptured] = useState(true); // Whether the twitter handle has been grabbed from the user
  
    const [showDiscord, setShowDiscord] = useState(false); // Whether to show the discord input form
    const [discord, setDiscord] = useState(req.discord ? req.discord : ""); // Discord handle of the user
    const [discordCaptured, setDiscordCaptured] = useState(true); // Whether the discord handle has been grabbed from the user
  
    const [showColorOptions, setShowColorOptions] = useState(false); // Whether to show the color options input form
    const [colorOption, setColorOption] = useState(req.colorOption ? req.colorOption : ""); // Color option of the user
  
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
    const [userPublicKey, setUserPublicKey] = useState(req.userPublicKey ? req.userPublicKey : "");
    const [userEmail, setUserEmail] = useState(req.email ? req.email : "");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [txHash, setTxHash] = useState("");
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
    var tokenType = req.token.toLowerCase();
    const id = req.id ? req.id : '';
    const symbol = '';
    const product = req.product ? req.product : '';
    const price = req.price;
    console.log('token type is: ', tokenType)
    const buyerAddy = req.buyer;
    const owner = req.recipient ? req.recipient : '';
    var itemPrice = req.price ? req.price : 0;
    var token = req.token ? req.token : '';
    var noteToOwner = req.noteToOwner ? req.noteToOwner : '';
    var collection = req.collection ? req.collection : '';
    const order = useMemo(
      () => ({
        id: id,
        buyer: buyerAddy.toString(),
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
        note: note != null ? note : noteToOwner,
        colorOption: colorOption,
        collection: collection,
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
    const createAndSendTransaction = async () => {
        try{
          setLoading(true);

          const sellerAddress = owner;
          const sellerPublicKey = new web3.PublicKey(sellerAddress);

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
    
            var message = "Magic Direct Transfer";
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
            
            console.log(`https://solana.fm/tx/${signature}`);
            // one second timeout
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setTxHash(signature);
            setSuccess(true);
            addOrder(order);
            setLoading(false);
          }
        } catch (error) {
          console.log("error", error);
          console.log('error', error.message)
          // if error message is 'Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1'
          //alert('Transaction failed, due to insufficient funds.')
          if(error.message === 'failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1') {
            setErrorMsg('Transaction failed, due to insufficient funds.')
            setError(true);
          }else{
            setErrorMsg('Transaction failed, please try again.')
            setError(true);
          }
          setLoading(false);
        }
    };

    useEffect(() => {
        if (success) {
            window.dispatchEvent(new Event("refreshBalance"));
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
        if (error) {
            setTimeout(() => {
                setError(false);
            }, 3000);
        }
    }, [success, error]);

    return (
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
        {!success && !error && (
          <button
              className={styles.send_btn}
              onClick={()=> createAndSendTransaction()}
              disabled={loading}
          >
              {loading && !success ? (<span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>) : `Pay ${itemPrice} ${token.toUpperCase()}`}
          </button>
        )}
        {success && (
            <div className="alert alert-success" role="alert"> 
              Transaction successful!<br />
              <a className="text-primary pe-auto" href={`https://solana.fm/tx/${txHash}`} target="_blank" rel="noreferrer">View on chain.</a>
            </div>
        )}
        {error && (
            <div className="alert alert-danger" role="alert">
              {errorMsg != "" ? errorMsg : 'Transaction failed, please try again.'}
            </div>
        )}
      </div>
    
    );
}

export default Send;