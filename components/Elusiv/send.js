import React, {useState, useEffect, useMemo} from "react";
// import { generatePrivateKey } from "../../utils/generateKeypair";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
// import { Elusiv, TokenType } from "elusiv-sdk";
import Loading from "../Loading";
import styles from "./styles/Send.module.css";
// import ElusivSetup from "../../components/Elusiv/userSetUp";


const SendElusiv = (req) => {
    const [loading, setLoading] = useState(false);
    // const [userPW, setUserPW] = useState(null);
    const userPW = 'IkonShopEncodeHackathon'
    const [txnSent, setTxnSent] = useState(false);
    // const sendAmount = req.price;
    // const recipient = req.owner;
    // const [elusivBalance, setElusivBalance] = useState(null);
    // const { publicKey, signTransaction } = useWallet();

    // const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
    // const MAINNET_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
    // const connection = new Connection(DEVNET_RPC_URL);
    
    // async function checkPrivateBalance() {
    //     // Helper function for generating the elusiv instance 
    //     // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    //     const seed = await Elusiv.hashPw(userPW);
    //     const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
    //     console.log('checking private balance')
    //     // Fetch our current private balance
    //     const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')
    //     console.log('Current private balance: ', privateBalance)
    //     //convert to sol
    //     const solBalance = parseFloat(privateBalance) / LAMPORTS_PER_SOL;
    //     setElusivBalance(solBalance);
    //     console.log('Current private balance in SOL: ', solBalance)
    //     // We have no private balance? Top up! (We can also top up if we already have a private balance of course)
        
    //     window.localStorage.setItem('elusivBalance', solBalance);

    //     if (solBalance < sendAmount) {
    //         alert('You do not have enough private balance to send this amount. Please top up your private balance first.');
    //         setLoading(false);
    //         return;
    //     }
    // }

    // async function send() {
    //     setLoading(true);
    //     console.log('send amount', sendAmount);
    //     const seed = await Elusiv.hashPw(userPW);
    //     const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
    //     const receiverPublicKey = recipient ? new PublicKey(recipient) : null;
    //     console.log('send starting with recipient', receiverPublicKey.toString());
    //     await checkPrivateBalance();
    //     console.log('elusiv balance and send amount', elusivBalance, sendAmount);
        
        
    //     // Send half a SOL, privately 😎
    //     const sendTx = await elusiv.buildSendTx(sendAmount * LAMPORTS_PER_SOL, receiverPublicKey, 'LAMPORTS');
    
    //     const sendRes = await elusiv.sendElusivTx(sendTx);
    //     setLoading(false);
    //     // console.log('send res', sendRes);
    //     if(sendRes.isConfirmed.promiseResult) {
    //         console.log(sendRes.res.sig.sginature);
    //     }
    //     console.log('Ta-da!');
    // }

    // const onSubmit = async(e) => {
    //     setLoading(true);
    //     e.preventDefault();
    //     console.log("submit");        
    //     await send();
    // }

    // const onChange = (e) => {
    //     console.log("change");
    //     setUserPW(e.target.value);
    // }

    // const onSendAmountChange = (e) => {
    //     console.log("change");
    //     setSendAmount(e.target.value);
    // }

    // const renderSubmit = () => {
    //     return (
    //         <form className={styles.form}>
    //             {/* <label className={styles.label} htmlFor="password">Elusiv Password</label>
    //             <input type="password" onChange={onChange} name="password" id="password" /> */}      
    //             <button 
    //                 type="submit"
    //                 onClick={onSubmit}
    //                 className="buy-button"
    //             >
    //                 Send Tip
    //             </button>
    //         </form>
    //     )
    // }




    return(
        <div>
            {/* {!loading && renderSubmit()} */}
            {loading && <Loading />}
        </div>
    )

}

export default SendElusiv;