import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Keypair, clusterApiUrl, Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { gql, GraphQLClient } from 'graphql-request';
import React , { useState, useEffect } from 'react';
import base58 from 'bs58'
import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';


require("dotenv").config();
const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";

const shopSecretKey = process.env.NEXT_PUBLIC_SHOP_SECRET_KEY;
const shopKeypair = Keypair.fromSecretKey(base58.decode(shopSecretKey));
const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
// SPL TOKEN ADDRESS
const usdcAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const dustAddress = new PublicKey("DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ");
const gmtAddress = new PublicKey("7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxR4pfRx");
const goreAddress = new PublicKey("6wJYjYRtEMVsGXKzTuhLmWt6hfHX8qCa6VXn4E4nGoyj");
const peskyAddress = new PublicKey("nooot44pqeM88dcU8XpbexrmHjK7PapV2qEVnQ9LJ14");
const creckAddress = new PublicKey("Ao94rg8D6oK2TAq3nm8YEQxfS73vZ2GWYw2AKaUihDEY");
const groarAddress = new PublicKey("GroARooBMki2hcpLP6QxEAgwyNgW1zwiJf8x1TfTVkPa");
const forgeAddress = new PublicKey("FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds");
const rainAddress = new PublicKey("rainH85N1vCoerCi4cQ3w6mCf7oYUdrsTFtFzpaRwjL");
const foxyAddress = new PublicKey("FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq");

// ******************MAGIC


const handleSendTransaction = async () => {
  setSendingTransaction(true);
  const recipientPubKey = new web3.PublicKey(destinationAddress);
  const payer = new web3.PublicKey(userMetadata.publicAddress);

  const hash = await connection.getRecentBlockhash();

  let transactionMagic = new web3.Transaction({
    feePayer: payer,
    recentBlockhash: hash.blockhash
  });

  const transaction = web3.SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: recipientPubKey,
    lamports: sendAmount
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
  setTxHash(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  setSendingTransaction(false);
};

// *********************MAGIC

// MAIN ADDRESS FOR STORE
// **TODO: CREATE A NEW ADDRESS FOR PER COLLECTION
// const sellerAddress = "8YB9vvdKu1LbZqf9po8MUtUATbUDLAtNEvZviYgZpygv";

// MERCHANT CUT ADDRESS
// store addy
const secondAddress = "GJ583UebPiedxYi5zQV4n3H1GkALuYpmb15kP8DDgF3X";
const storePublicKey = new PublicKey(secondAddress);
// test addy (turtles)
// const secondAddress = "2MDo6HGjoES56SefvevNJCtAst3pk12B6srUSruYVinX";
// Kruz address
// const secondAddress = "6ox3xVrZkUnyC7jKuQzx1P3Uxon81JvQk9k8Xy37kvCT";

const secondPublicKey = new PublicKey(secondAddress);

// Emperor Addy
// const emperorAddress = "8YB9vvdKu1LbZqf9po8MUtUATbUDLAtNEvZviYgZpygv";
// const emperorPublicKey = new PublicKey(emperorAddress);

const createTransaction = async (req, res) => {
  // console.log('intl', req.body.shippingInfo.international)
  try {
   //1 sec delay before continuing

    
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
    const sellerPublicKey = new PublicKey(sellerAddress);
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
    const buyerPublicKey = new PublicKey(buyerAddy);
    var network = WalletAdapterNetwork.Mainnet;
    if(elusiv === true) {
      console.log("ELUSIV IS TRUE");
      var network = WalletAdapterNetwork.Devnet;
    }
    // const network = WalletAdapterNetwork.Devnet;

    const endpoint = clusterApiUrl(network);
    const block_connection = new Connection(endpoint, "confirmed");
    // const connection = new Connection(
    //   "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    //   "confirmed"
    // );
    const connection = new Connection(endpoint, "confirmed");


    
    const { blockhash } = await block_connection.getLatestBlockhash("finalized");

    const tx = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });
    

    // SHIPPING INTERNATIONAL COST
    if (international === "true") {
      const internationalShippingCost = BigNumber(0.25);
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        // Lamports are the smallest unit of SOL, like Gwei with Ethereum
        lamports: (internationalShippingCost.multipliedBy(LAMPORTS_PER_SOL).toNumber()),  
        toPubkey: sellerPublicKey,
        });

        // const transferTwo = SystemProgram.transfer({
        //   fromPubkey: buyerPublicKey,
        //   lamports: (bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber() * .2),
        //   toPubkey: secondPublicKey,
        // })


        console.log("these are the instructions ->", transferInstruction)

        transferInstruction.keys.push({
          pubkey: new PublicKey(orderID),
          isSigner: false,
          isWritable: false,
        });

        // tx.add(transferInstruction, transferTwo);
        tx.add(transferInstruction);
    }
    


    if(itemTokenType === "sol") {
        const transferInstruction = SystemProgram.transfer({
        fromPubkey: buyerPublicKey,
        // Lamports are the smallest unit of SOL, like Gwei with Ethereum
        lamports: (bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber()), 
        toPubkey: sellerPublicKey,
        });

        // const transferTwo = SystemProgram.transfer({
        //   fromPubkey: buyerPublicKey,
        //   lamports: (bigAmount.multipliedBy(LAMPORTS_PER_SOL).toNumber() * .2),
        //   toPubkey: secondPublicKey,
        // })


        console.log("these are the instructions ->", transferInstruction)

        transferInstruction.keys.push({
          pubkey: new PublicKey(orderID),
          isSigner: false,
          isWritable: false,
        });

        // tx.add(transferInstruction, transferTwo);
        tx.add(transferInstruction);
    }
    if (itemTokenType === "usdc") {
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

      const transferInstruction = createTransferCheckedInstruction(
        buyerUsdcAddress, 
        usdcAddress,     // This is the address of the token we want to transfer
        shopUsdcAddress, 
        buyerPublicKey, 
        ((bigAmount.toNumber() * 10 ** (await usdcMint).decimals)), 
        usdcMint.decimals // The token could have any number of decimals
      );
    
      const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
            solana: new SolanaExtension({
            rpcUrl
            })
        }
      });
    
      const transactionMagic = web3.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: recipientPubKey,
      });
    
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
      console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    }

    if(itemTokenType === "dust") {
      const buyerDustAcc = await getAssociatedTokenAddress(dustAddress, buyerPublicKey);
      const shopDustAcc = await getAssociatedTokenAddress(dustAddress, sellerPublicKey);
      const secondDustAdress = await getAssociatedTokenAddress(dustAddress, secondPublicKey);
      const dustMint = await getMint(connection, dustAddress);
      const dustAmount = ((bigAmount.toNumber() * 10 ** (await dustMint).decimals));
      var buyerDustAddress = await getAssociatedTokenAddress(dustAddress, buyerPublicKey);
      var shopDustAddress = await getAssociatedTokenAddress(dustAddress, sellerPublicKey);

      const checkAccounts = async() => {
        const buyerDustAccount = await connection.getAccountInfo(buyerDustAcc);
        if (buyerDustAccount === null) {
          console.log("buyer has no dust account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, dustAddress, buyerPublicKey);
          var buyerDustAddress = await newAccount.address;

        }else{
          var buyerDustAddress = await getAssociatedTokenAddress(dustAddress, buyerPublicKey);
          console.log("buyer has dust account", buyerDustAddress.toString());

        }
      }

        await checkAccounts();
      const transferInstruction = createTransferCheckedInstruction(
        buyerDustAddress,
        dustAddress,
        shopDustAddress,
        buyerPublicKey,
        dustAmount,
        dustMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });
      tx.add(transferInstruction);
    }

    if(itemTokenType === "gmt") {
      const gmtMint = await getMint(connection, gmtAddress);
      const gmtAmount = ((bigAmount.toNumber() * 10 ** (await gmtMint).decimals));
      const buyerGmtAcc = await getAssociatedTokenAddress(gmtAddress, buyerPublicKey);
      const shopGmtAcc = await getAssociatedTokenAddress(gmtAddress, sellerPublicKey);
      const secondGmtAdress = await getAssociatedTokenAddress(gmtAddress, secondPublicKey);
      var buyerGmtAddress = await getAssociatedTokenAddress(gmtAddress, buyerPublicKey);
      var shopGmtAddress = await getAssociatedTokenAddress(gmtAddress, sellerPublicKey);

      const checkAccounts = async() => {
        const buyerGmtAccount = await connection.getAccountInfo(buyerGmtAcc);
        if (buyerGmtAccount === null) {
          console.log("buyer has no gmt account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, gmtAddress, buyerPublicKey);
          var buyerGmtAddress = await newAccount.address;

        }else{
          var buyerGmtAddress = await getAssociatedTokenAddress(gmtAddress, buyerPublicKey);
          console.log("buyer has gmt account", buyerGmtAddress.toString());

        }
      }

        await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerGmtAddress,
        gmtAddress,
        shopGmtAddress,
        buyerPublicKey,
        gmtAmount,
        gmtMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });
      tx.add(transferInstruction);
    }

    if(itemTokenType === "gore") {
      const buyerGoreAcc = await getAssociatedTokenAddress(goreAddress, buyerPublicKey);
      const shopGoreAcc = await getAssociatedTokenAddress(goreAddress, sellerPublicKey);
      var shopGoreAddress = await getAssociatedTokenAddress(goreAddress, sellerPublicKey);
      var buyerGoreAddress = await getAssociatedTokenAddress(goreAddress, buyerPublicKey);

      

      // Check if the buyer has a gore account
      const checkAccounts = async() => {
      const buyerGoreAccount = await connection.getAccountInfo(buyerGoreAcc);
      if (buyerGoreAccount === null) {
        console.log("buyer has no gore account");
        const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, goreAddress, buyerPublicKey);
        var buyerGoreAddress = await newAccount.address;
        console.log("buyer gore account created", buyerGoreAddress.toString());

      }else{
        var buyerGoreAddress = await getAssociatedTokenAddress(goreAddress, buyerPublicKey);
        console.log("buyer has gore account", buyerGoreAddress.toString());

      }
      // Check if the shop has a gore account
      const shopGoreAccount = await connection.getAccountInfo(shopGoreAcc);
      if (shopGoreAccount === null) {
        console.log("shop has no gore account");
        const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, goreAddress, sellerPublicKey);
        var shopGoreAddress = await newAccount.address
        console.log("shop gore address ->", shopGoreAddress.toString());
      }
      else{
        var shopGoreAddress = await getAssociatedTokenAddress(goreAddress, sellerPublicKey);
      }
    }
      await checkAccounts();
      const secondGoreAdress = await getAssociatedTokenAddress(goreAddress, secondPublicKey);
      const goreMint = await getMint(connection, goreAddress);

      const goreAmount = ((bigAmount.toNumber() * 10 ** (await goreMint).decimals));
      const transferInstruction = createTransferCheckedInstruction(
        buyerGoreAddress,
        goreAddress,
        shopGoreAddress,
        buyerPublicKey,
        goreAmount,
        goreMint.decimals,
      );


      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });



    tx.add( transferInstruction)
    }

    if(itemTokenType === "pesky") {
      const buyerPeskyAcc = await getAssociatedTokenAddress(peskyAddress, buyerPublicKey);
      const shopPeskyAcc= await getAssociatedTokenAddress(peskyAddress, sellerPublicKey);
      const secondPeskyAdress = await getAssociatedTokenAddress(peskyAddress, secondPublicKey);
      const peskyMint = await getMint(connection, peskyAddress);
      const peskyAmount = ((bigAmount.toNumber() * 10 ** (await peskyMint).decimals));
      var shopPeskyAddress = await getAssociatedTokenAddress(peskyAddress, sellerPublicKey);
      var buyerPeskyAddress = await getAssociatedTokenAddress(peskyAddress, buyerPublicKey);
      
      const checkAccounts = async() => {
        const buyerPeskyAccount = await connection.getAccountInfo(buyerPeskyAcc);
        if (buyerPeskyAccount === null) {
          console.log("buyer has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, peskyAddress, buyerPublicKey);
          var buyerPeskyAddress = await newAccount.address;
          
  
        }else{
          var buyerPeskyAddress = await getAssociatedTokenAddress(peskyAddress, buyerPublicKey);
          console.log("buyer has gore account", buyerPeskyAddress.toString());
  
        }
        // Check if the shop has a gore account
        const shopPeskyAccount = await connection.getAccountInfo(shopPeskyAcc);
        if (shopPeskyAccount === null) {
          console.log("shop has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, peskyAddress, sellerPublicKey);
          var shopPeskyAddress = await newAccount.address
          
        }
        else{
          var shopPeskyAddress = await getAssociatedTokenAddress(peskyAddress, sellerPublicKey);
        }
      }
      await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerPeskyAddress,
        peskyAddress,
        shopPeskyAddress,
        buyerPublicKey,
        peskyAmount,
        peskyMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });
      tx.add(transferInstruction);
    }

    if(itemTokenType === "creck") {
      const creckMint = await getMint(connection, creckAddress);
      const creckAmount = ((bigAmount.toNumber() * 10 ** (await creckMint).decimals));
      const buyerCreckAcc = await getAssociatedTokenAddress(creckAddress, buyerPublicKey);
      const shopCreckAcc= await getAssociatedTokenAddress(creckAddress, sellerPublicKey);
      const secondCreckAdress = await getAssociatedTokenAddress(creckAddress, secondPublicKey);
      var shopCreckAddress = await getAssociatedTokenAddress(creckAddress, sellerPublicKey);
      var buyerCreckAddress = await getAssociatedTokenAddress(creckAddress, buyerPublicKey);

      const checkAccounts = async() => {
        const buyerCreckAccount = await connection.getAccountInfo(buyerCreckAcc);
        if (buyerCreckAccount === null) {
          console.log("buyer has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, creckAddress, buyerPublicKey);
          var buyerCreckAddress = await newAccount.address;

        }else{
          var buyerCreckAddress = await getAssociatedTokenAddress(creckAddress, buyerPublicKey);
          console.log("buyer has gore account", buyerCreckAddress.toString());

        }
      }

        await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerCreckAddress,
        creckAddress,
        shopCreckAddress,
        buyerPublicKey,
        creckAmount,
        creckMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });

      tx.add(transferInstruction);
    }

    if(itemTokenType === "groar") {
      const groarMint = await getMint(connection, groarAddress);
      const groarAmount = ((bigAmount.toNumber() * 10 ** (await groarMint).decimals));
      const buyerGroarAcc = await getAssociatedTokenAddress(groarAddress, buyerPublicKey);
      const shopGroarAcc= await getAssociatedTokenAddress(groarAddress, sellerPublicKey);
      const secondGroarAdress = await getAssociatedTokenAddress(groarAddress, secondPublicKey);
      var shopGroarAddress = await getAssociatedTokenAddress(groarAddress, sellerPublicKey);
      var buyerGroarAddress = await getAssociatedTokenAddress(groarAddress, buyerPublicKey);

      const checkAccounts = async() => {
        const buyerGroarAccount = await connection.getAccountInfo(buyerGroarAcc);
        if (buyerGroarAccount === null) {
          console.log("buyer has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, groarAddress, buyerPublicKey);
          var buyerGroarAddress = await newAccount.address;
          
        }else{
          var buyerGroarAddress = await getAssociatedTokenAddress(groarAddress, buyerPublicKey);
          console.log("buyer has gore account", buyerGroarAddress.toString());

        }
      }

        await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerGroarAddress,
        groarAddress,
        shopGroarAddress,
        buyerPublicKey,
        groarAmount,
        groarMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });

      tx.add(transferInstruction);
    }

    if(itemTokenType === "forge") {
      const forgeMint = await getMint(connection, forgeAddress);
      const forgeAmount = ((bigAmount.toNumber() * 10 ** (await forgeMint).decimals));
      const buyerForgeAcc = await getAssociatedTokenAddress(forgeAddress, buyerPublicKey);
      const shopForgeAcc= await getAssociatedTokenAddress(forgeAddress, sellerPublicKey);
      const secondForgeAdress = await getAssociatedTokenAddress(forgeAddress, secondPublicKey);
      var shopForgeAddress = await getAssociatedTokenAddress(forgeAddress, sellerPublicKey);
      var buyerForgeAddress = await getAssociatedTokenAddress(forgeAddress, buyerPublicKey);

      const checkAccounts = async() => {
        const buyerForgeAccount = await connection.getAccountInfo(buyerForgeAcc);
        if (buyerForgeAccount === null) {
          console.log("buyer has no gore account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, forgeAddress, buyerPublicKey);
          var buyerForgeAddress = await newAccount.address;

        }else{
          var buyerForgeAddress = await getAssociatedTokenAddress(forgeAddress, buyerPublicKey);
          console.log("buyer has gore account", buyerForgeAddress.toString());

        }
      }


        await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerForgeAddress,
        forgeAddress,
        shopForgeAddress,
        buyerPublicKey,
        forgeAmount,
        forgeMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });

      tx.add(transferInstruction);
    }

    if(itemTokenType === "rain") {
      const rainMint = await getMint(connection, rainAddress);
      const rainAmount = ((bigAmount.toNumber() * 10 ** (await rainMint).decimals));
      const buyerRainAcc = await getAssociatedTokenAddress(rainAddress, buyerPublicKey);
      const shopRainAcc= await getAssociatedTokenAddress(rainAddress, sellerPublicKey);
      const secondRainAdress = await getAssociatedTokenAddress(rainAddress, secondPublicKey);
      var shopRainAddress = await getAssociatedTokenAddress(rainAddress, sellerPublicKey);
      var buyerRainAddress = await getAssociatedTokenAddress(rainAddress, buyerPublicKey);

      const checkAccounts = async() => {
        const buyerRainAccount = await connection.getAccountInfo(buyerRainAcc);
        if (buyerRainAccount === null) {
          console.log("buyer has no rain account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, rainAddress, buyerPublicKey);
          var buyerRainAddress = await newAccount.address;

        }else{
          var buyerRainAddress = await getAssociatedTokenAddress(rainAddress, buyerPublicKey);
          console.log("buyer has rain account", buyerRainAddress.toString());

        }
      }


        await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerRainAddress,
        rainAddress,
        shopRainAddress,
        buyerPublicKey,
        rainAmount,
        rainMint.decimals
      );

      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });

      tx.add(transferInstruction);
    }

    if(itemTokenType === "foxy") {
      const foxyMint = await getMint(connection, foxyAddress);
      const foxyAmount = ((bigAmount.toNumber() * 10 ** (await foxyMint).decimals));
      const buyerFoxyAcc = await getAssociatedTokenAddress(foxyAddress, buyerPublicKey);
      const shopFoxyAcc= await getAssociatedTokenAddress(foxyAddress, sellerPublicKey);
      const secondFoxyAdress = await getAssociatedTokenAddress(foxyAddress, secondPublicKey);
      var shopFoxyAddress = await getAssociatedTokenAddress(foxyAddress, sellerPublicKey);
      var buyerFoxyAddress = await getAssociatedTokenAddress(foxyAddress, buyerPublicKey);

      const checkAccounts = async() => {
        const buyerFoxyAccount = await connection.getAccountInfo(buyerFoxyAcc);
        if (buyerFoxyAccount === null) {
          console.log("buyer has no foxy account");
          const newAccount = await createAssociatedTokenAccount(connection, shopKeypair, foxyAddress, buyerPublicKey);
          var buyerFoxyAddress = await newAccount.address;

        }else{
          var buyerFoxyAddress = await getAssociatedTokenAddress(foxyAddress, buyerPublicKey);
          console.log("buyer has foxy account", buyerFoxyAddress.toString());

        }
      }

      await checkAccounts();

      const transferInstruction = createTransferCheckedInstruction(
        buyerFoxyAddress,
        foxyAddress,
        shopFoxyAddress,
        buyerPublicKey,
        foxyAmount,
        foxyMint.decimals
      );


      transferInstruction.keys.push({
        pubkey: new PublicKey(orderID),
        isSigner: false,
        isWritable: false,
      });

      tx.add(transferInstruction);
    }
    
    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });

    const base64 = serializedTransaction.toString("base64");

    res.status(200).json({
      transaction: base64,
    });
  } catch (err) {
    console.error("error is",err);

    res.status(500).json({ error: "error creating transaction" });
    return;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    createTransaction(req, res);
  } else {
    
    res.status(405).end();
  }
}