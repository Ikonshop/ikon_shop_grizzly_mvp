import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";
import { CreateCollectionFromMagic, GetCollectionByEmail  } from "../../lib/api";
import Loading from "../Loading";

const buyMagic = (order) => {
  console.log('incoming order', order)
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [txHash, setTxHash] = useState("");
  const [sendingTransaction, setSendingTransaction] = useState(false);

  const handleSendTransaction = async () => {
    setSendingTransaction(true);

    const magic = new Magic("pk_live_FCF04103A9172B45", {
      extensions: {
      solana: new SolanaExtension({
          rpcUrl
      })
      }
    });
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

return (
  <div>
    <button onClick={handleSendTransaction}>Send Transaction</button>
  </div>
);

}

export default buyMagic;

