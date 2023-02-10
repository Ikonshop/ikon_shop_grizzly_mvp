import React, {useState, useEffect, useMemo} from "react";
import { generatePrivateKey } from "../../utils/generateKeypair";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
// import { Elusiv, TokenType } from "elusiv-sdk";
import styles from "../Elusiv/styles/ElusivLink.module.css";



const RecentTxns = () => {
    const [loading, setLoading] = useState(false);
    // const [userPW, setUserPW] = useState(null);
    const userPW = 'IkonShopEncodeHackathon'
    const [recentTxns, setRecentTxns] = useState(null);
    const { publicKey, signTransaction } = useWallet();
    const USER_PASSWORD = 'password';
    const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
    const MAINNET_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
    const connection = new Connection(DEVNET_RPC_URL);
    
    // async function getRecentTxns() {
    //           //generate a keypair from the connected wallet
    //     // Get the public key
    //     console.log('topup starting', publicKey.toString(), userPW, connection);
    //     const seed = await Elusiv.hashPw('password');
    
    //     // Create the elusiv instance
    //     const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
    //     // Fetch our most recent private transactions of any token type
    //     const mostRecentPrivTx = await elusiv.getPrivateTransactions(1);
    
    //     console.log("Our most recent private transaction:\n");
    //     console.log(mostRecentPrivTx);
    
    //     // Fetch our last 5 private transactions using Sol (if we only have 1 it will only return 1 of course)
    //     const last5PrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');
    
    //     console.log("Our last 5 private transactions:\n");
    //     console.log(last5PrivTxs);

    //     setRecentTxns(last5PrivTxs);
    // }

    const dummyTxns = [
        {
            "id": "1",
            "amount": "1",
            "type": "SOL",
            "recipient": "57mR...1ERv",
            "sender": "7wK3...qR2n",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "2",
            "amount": "4",
            "type": "SOL",
            "recipient": "2fA6...1ERv",
            "sender": "7wK3...qR2n",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "3",
            "amount": "10",
            "type": "SOL",
            "recipient": "57mR...1ERv",
            "sender": "7wK3...qR2n",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "4",
            "amount": ".5",
            "type": "SOL",
            "recipient": "57mR...1ERv",
            "sender": "7wK3...qR2n",
            "timestamp": "2021-08-01T00:00:00.000Z"
        },
        {
            "id": "5",
            "amount": "3",
            "type": "SOL",
            "recipient": "ykGd...BjeQ",
            "sender": "7wK3...qR2n",
            "timestamp": "2021-08-01T00:00:00.000Z"
        }
    ]

    return (
        // DEMO RENDERING
        <div className={styles.container}>
            {/* <div className={styles.recentTxns}>
                <h2 className={styles.form_header_text}>Most Recent Transaction</h2>
                <div className={styles.txn}>
                    <div className={styles.txnInfo}>
                        <p><span>Amount:</span> {dummyTxns[0].amount}</p> 
                        <p><span>Type:</span> {dummyTxns[0].type}</p>
                        <p><span>Recipient: </span>{dummyTxns[0].recipient}</p>
                        <p><span>Sender:</span> {dummyTxns[0].sender}</p>
                        <p><span>Timestamp:</span> {new Date(dummyTxns[0].timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            <div className={styles.last5Txns}>
                <h2 className={styles.table_header_text}>Last 5 Transactions</h2>
                <table className={styles.sub_table}>
                    <thead>
                        <tr>
                            <th>Amount</th> 
                            <th>Type</th>
                            <th>Recipient</th>
                            <th>Sender</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyTxns.map((txn, index) => (
                            <tr key={index}>
                                <td>{txn.amount}</td>
                                <td>{txn.type}</td>
                                <td>{txn.recipient}</td>
                                <td>{txn.sender}</td>
                                <td>{new Date(txn.timestamp).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>

        // REAL RENDERING
    //    <div className={styles.container}>
    //         <div className={styles.recentTxns}>
    //             <h2 className={styles.form_header_text}>Most Recent Transaction</h2>
    //             <div className={styles.txn}>
    //                 <div className={styles.txnInfo}>
    //                     <p><span>Amount:</span> {recentTxns.length > 0 ? recentTxns[0].amount : null}</p> 
    //                     <p><span>Type:</span> {recentTxns.length > 0 ? recentTxns[0].type : null}</p>
    //                     <p><span>Recipient: </span>{recentTxns.length > 0 ? recentTxns[0].recipient : null}</p>
    //                     <p><span>Sender:</span> {recentTxns.length > 0 ? recentTxns[0].sender : null}</p>
    //                     <p><span>Timestamp:</span> {recentTxns.length > 0 ? new Date(recentTxns[0].timestamp).toLocaleDateString() : null}</p>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className={styles.last5Txns}>
    //             <h2 className={styles.table_header_text}>Last 5 Transactions</h2>
    //             {recentTxns.length > 0 ? (
    //                 <table className={styles.sub_table}>
    //                     <tr>
    //                         <th>Amount</th> 
    //                         <th>Type</th>
    //                         <th>Recipient</th>
    //                         <th>Sender</th>
    //                         <th>Timestamp</th>
    //                     </tr>
    //                     {recentTxns.map((txn, index) => (
    //                         <tr key={index}>
    //                             <td>{txn.amount}</td>
    //                             <td>{txn.type}</td>
    //                             <td>{txn.recipient}</td>
    //                             <td>{txn.sender}</td>
    //                             <td>{new Date(txn.timestamp).toLocaleDateString()}</td>
    //                         </tr>
    //                     ))}
    //                 </table>
    //             ) : (
    //                 <p>No transactions found</p>
    //             )}
    //         </div>
    //     </div>
    )
}

export default RecentTxns;