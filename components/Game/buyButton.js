import React, {useEffect, useState, useMemo} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const STATUS = {
    Initial: "Initial",
    Submitted: "Submitted",
    Paid: "Paid",
  };

const BuyButton = ({listing}) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(STATUS.Idle);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const {publicKey, sendTransaction} = useWallet();
    

    // const processTransaction = async () => {
    //     setLoading(true);
    //     console.log("sending this order", order);
    //     const txResponse = await fetch("../api/createTransaction", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(order),
    //     });
    
    //     const txData = await txResponse.json();
    //     // console.log("txData", txData);
    //     const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    //     // console.log("Tx data is", tx);
    //     // console.log("here is the order man", order);
    //     // Attempt to send the transaction to the network
    //     try {
    //       // await sendTransaction and catch any error it returns
    
    //       const txHash = await sendTransaction(tx, connection);
    //       // Wait for the transaction to be confirmed
    //       // set the txHash as the order.orderID
    //       order.orderID = txHash;
          
    //       console.log("txHash", txHash);
    //       // console.log("orderID", orderID);
          
    //       console.log(
    //         `Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`
    //       );
    //       setStatus(STATUS.Submitted);
    //     } catch (error) {
    //       console.error(error);
    //       if (error.code === 4001) {
    //         <Red message="Transaction rejected by user" />;
    //       }
    //       if (error.code === -32603 || error.code === -32003) {
    //         <Red message="Transaction failed, probably due to one of the wallets not having this token" />;
    //       }
    //       if (error.code === -32000) {
    //         <Red message="Transaction failed" />;
    //       }
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const processTransaction = async () => {
        setLoading(true);
        console.log("sending this order", order);
        const txResponse = await fetch("../api/buyListing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
            });

        const txData = await txResponse.json();
        console.log("txData", txData);

        const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
        console.log("Tx data is", tx);

        // Attempt to send the transaction to the network
        try {
            // await sendTransaction and catch any error it returns
            const txHash = await sendTransaction(tx, connection);
            // Wait for the transaction to be confirmed
            // set the txHash as the order.orderID
            order.orderID = txHash;
            console.log("txHash", txHash);
            console.log("orderID", orderID);
            console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=mainnet`);
            setStatus(STATUS.Submitted);
        }
        catch (error) {
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
        }
        finally {
            setLoading(false);
        }
    };

    return(
        <button
            className="btn btn-primary"
            onClick={processTransaction}
            disabled={loading}
        >
            Buy
        </button>
    )
}

export default BuyButton;

