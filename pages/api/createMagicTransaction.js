import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import * as web3 from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { gql, GraphQLClient } from 'graphql-request';
import React , { useState, useEffect } from 'react';
import base58 from 'bs58'
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';


require("dotenv").config();
const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
const connection = new web3.Connection(rpcUrl, "confirmed");x`x   `
const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = Keypair.fromSecretKey(base58.decode(shopSecretKey));
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


const handleSendTransaction = (req) => {
  setSendingTransaction(true);
  const createAndSendTransaction = async () => {
    try{
      const graphQLClient = new GraphQLClient((graphqlAPI), {
        headers: {
          authorization: `Bearer ${GRAPHCMS_TOKEN}`,
        },
      });
      const { buyer, orderID } = req.body;
      console.log("req.body on txn", req.body);
      if (!buyer) {
        res.status(400).json({
          message: "Missing buyer address",
        });
      }
  
      if (!orderID) {
        res.status(400).json({
          message: "Missing order ID",
        });
      }
      var tokenType = req.body.token
      const id = req.body.id;
      const buyerAddy = req.body.buyer;
      const owner = req.body.owner;
      var itemPrice = req.body.price;
      const elusiv= req.body.elusiv;
      console.log("TOKEN TYPE IS THIS!!!", tokenType);
      // const { publicKey, signTransaction }= useWallet();
  
      const sellerAddress = owner;
      console.log("SELLER ADDRESS IS THIS!!!", sellerAddress);
      const sellerPublicKey = new web3.PublicKey(sellerAddress);
      console.log("SELLER PUBLIC KEY IS THIS!!!", sellerPublicKey);
      const email = req.body.email;
      const shippingInfo = req.body.shippingInfo;
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
  
  
      // if result.product.type === "tipjar" then use req.body.token
      if(type !== "tipjar") {
        console.log("TYPE IS NOT TIPJAR");
        var tokenType = result.product.token;
        var itemPrice = result.product.price;
      }
  
  
      // for(var i = 0; i < result.length; i++) {
      //   console.log('result', result[i]);
      //   if(result.product.type === "tipjar"  ) {
      //     var tokenType = req.body.token;
      //     const itemPrice = req.body.price;
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


      const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
            solana: new SolanaExtension({
            rpcUrl
            })
        }
      });
      const userMetadata = await magic.user.getMetadata();
      const payer = new web3.PublicKey(userMetadata.publicAddress);

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
          lamports: (bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber()), 
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
        setTxHash(`https://explorer.solana.com/tx/${signature}`);
        setSendingTransaction(false);
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

        const transaction = new web3.Transaction().add(
          web3.SystemProgram.transfer({
            recentBlockhash: blockhash,
            feePayer: buyerPublicKey,
          })
        );

        const transferInstruction = createTransferCheckedInstruction(
          buyerUsdcAddress, 
          usdcAddress,     // This is the address of the token we want to transfer
          shopUsdcAddress, 
          buyerPublicKey, 
          ((bigAmount.toNumber() * 10 ** (await usdcMint).decimals)), 
          usdcMint.decimals // The token could have any number of decimals
        );
  
        transferInstruction.keys.push({
          pubkey: new web3.PublicKey(req.body.orderID),
          isSigner: false,
          isWritable: false,
        });
        
        transactionMagic.add(...[transaction]);
        transactionMagic.add(...[transferInstruction]);

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
        setTxHash(`https://explorer.solana.com/tx/${signature}`);
        setSendingTransaction(false);
      }
    } catch (error) {
      console.log("error", error);
      setSendingTransaction(false);
    }
  };

  return (
    <button
      onClick={() => createAndSendTransaction()}
      className="btn btn-primary"
    >
      {sendingTransaction ? "Sending Transaction..." : "Buy w/ Magic"}
    </button>
  );
};