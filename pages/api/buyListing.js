import * as web3 from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { createTransferCheckedInstruction, getAssociatedTokenAddress, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { gql, GraphQLClient } from 'graphql-request';
import React , { useState, useEffect } from 'react';
import base58 from 'bs58'

const createBuyTransaction = async (req, res) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    console.log('req.body', req.body)
    const buyer = req.body.buyer;
    const seller = req.body.seller;
    const auctionHouseAddress = req.body.auctionHouseAddress;
    const tokenMint = req.body.tokenMint;
    const tokenATA = req.body.tokenATA;
    const price = req.body.price;
    const sellerReferral = 'autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2';
    const sellerExpiry = 0;

    
    try{
        // const response = await fetch("api-devnet.magiceden.dev/v2/instructions/buy_now?buyer=BR5yr7fMRsmKLCt8LAn3UjkaWERyPhmJZQkRxkKX29Lq&seller=EdUK2ijRsAotd33aHFoLAtdSFfe6KxQnwC81Up37WFfj&auctionHouseAddress=E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe&tokenMint=DY95JfPRtwnRB259coEFe3xdBLikDSoo14DbnnpjXhhc&tokenATA=GhBVuTNXeavyVDznEfSaU9wK3VzKRvoXk3YzPqjZcPwT&price=11111&buyerReferral=&sellerReferral=autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2&buyerExpiry=&sellerExpiry=0", requestOptions)
        const response = await fetch(
            `https://api-devnet.magiceden.dev/v2/instructions/buy_now?buyer=${buyer}&seller=${seller}&auctionHouseAddress=${auctionHouseAddress}&tokenMint=${tokenMint}&tokenATA=${tokenATA}&price=${price}&buyerReferral=&sellerReferral=${sellerReferral}&buyerExpiry=&sellerExpiry=${sellerExpiry}`,
            requestOptions)
        console.log("response is", response);

        const block_connection = new web3.Connection(endpoint, "confirmed");
        const connection = new web3.Connection(
        "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
        "confirmed"
        );

    
        const { blockhash } = await block_connection.getLatestBlockhash("finalized");

        const tx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: buyerPublicKey,
        });

        tx.add(response);
        const serializedTransaction = tx.serialize({
          requireAllSignatures: false,
        });
            
        const base64 = serializedTransaction.toString("base64");
            
        res.status(200).json({
          transaction: base64,
        });
    }catch(err){
        console.log("error is", err);
        res.status(500).json({
            error: err,
        });
    }
}

export default function handler(req, res) {
    if (req.method === "POST") {
      createBuyTransaction(req, res);
    } else {
      
      res.status(405).end();
    }
  }



