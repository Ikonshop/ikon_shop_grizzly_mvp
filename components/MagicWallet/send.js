import React , { useState, useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as web3 from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import base58 from 'bs58'
import Loading from '../Loading';
import styles from "../../styles/Product.module.css";
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';
import Notification from "../Notification/Notification";


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



const Send = (req) => {
    console.log('sending', req)
    const orderID = useMemo(() => web3.Keypair.generate().publicKey, []);
    const [loading, setLoading] = useState(false);
    const [userPublicKey, setUserPublicKey] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [success, setSuccess] = useState(false);
    console.log('reqs are: ', req)
    const createAndSendTransaction = async () => {
        try{
          setLoading(true);
         
          var tokenType = req.token.toLowerCase();
          console.log('token type is: ', tokenType)
          const buyerAddy = req.buyer;
          const owner = req.recipient;
          var itemPrice = req.price;

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
            setSuccess(true);
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
        if (success) {
            window.dispatchEvent(new Event("refreshBalance"));
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        }
    }, [success]);

    return (
      <>
        {!success && (
          <button
              className="btn btn-primary"
              onClick={()=> createAndSendTransaction()}
              disabled={loading}
          >
              {loading && !success ? (<span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>) : "Send"}
          </button>
        )}
        {success && (
          // make the alert smaller
            <div className="alert alert-success" role="alert"> 
              Transaction successful!
            </div>
        )}
      </>
    
    );
}

export default Send;