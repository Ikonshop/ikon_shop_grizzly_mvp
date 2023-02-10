import React, {useState, useEffect, useMemo} from "react";
// import { generatePrivateKey } from "../../utils/generateKeypair";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { Keypair, LAMPORTS_PER_SOL, PublicKey, Connection } from "@solana/web3.js";
// import { Elusiv, TokenType } from "elusiv-sdk";
import styles from "../Elusiv/styles/ElusivLink.module.css";



const ElusivSetup = () => {
    const [loading, setLoading] = useState(false);
    // const [userPW, setUserPW] = useState(null);
    const userPW = 'IkonShopEncodeHackathon'
    // const [sendAmount, setSendAmount] = useState(null);
    // const [topUpAmount, setTopUpAmount] = useState(null);
    // const [topUpSent, setTopUpSent] = useState(false);
    // const [recipient, setRecipient] = useState(null);
    // const [elusivBalance, setElusivBalance] = useState(0);
    // const { publicKey, signTransaction } = useWallet();
    // const USER_PASSWORD = 'password';
    // const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
    // const MAINNET_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
    // const connection = new Connection(DEVNET_RPC_URL);
    
    // async function topup() {
    //   //generate a keypair from the connected wallet
    //   // Get the public key
    //   console.log('topup starting', publicKey.toString(), userPW, connection);
    //   const seed = await Elusiv.hashPw('password');
    
    //   // Create the elusiv instance
    //   const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
    //   console.log('topup starting');
    //   var amount = topUpAmount * LAMPORTS_PER_SOL;
    //   var tokenType = 'LAMPORTS';
    //   console.log('topup amount', amount);
    //   const topupTxData = await elusiv.buildTopUpTx(amount, tokenType);
    //   console.log('topupTxData', topupTxData);
    //   // Sign it (only needed for topups, as we're topping up from our public key there)
    //   //instead of using keyPair, have the user sign the transaction
    //   topupTxData.tx = await signTransaction(topupTxData.tx);
    //   // Send it off
    //   elusiv.sendElusivTx(topupTxData)
    
    //   setTopUpSent(true);  
    //   return ;
    // }

    // async function checkPrivateBalance() {
    //     console.log('checking balance', publicKey.toString(), userPW, connection);
    //   // Helper function for generating the elusiv instance 
    //   // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    //   const seed = await Elusiv.hashPw(userPW);
    //   const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection);
    //   console.log('checking private balance')

    //   console.log('querying private txns')
    //   const privateTxns = await elusiv.getPrivateTransactions();
    //   console.log('privateTxns', privateTxns)
    //   // Fetch our current private balance
    //   const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS')
    //   console.log('Current private balance: ', privateBalance)
    //   //convert to sol
    //   const solBalance = parseFloat(privateBalance) / LAMPORTS_PER_SOL;
    // //   const solBalance = 2;
    //   setElusivBalance(solBalance);
    //   console.log('Current private balance in SOL: ', solBalance)
    //   // We have no private balance? Top up! (We can also top up if we already have a private balance of course)

    //   window.localStorage.setItem('elusivBalance', solBalance);
    // }

    // const onCheckBalance = async(e) => {
    //     setLoading(true);
    //     e.preventDefault();
    //     console.log("submit");
    //     const res = await checkPrivateBalance();
    //     console.log('res', res);
    // }

    // const onTopUpAmountChange = (e) => {
    //     console.log("change");
    //     setTopUpAmount(e.target.value);
    // }


    // useEffect(() => {
    //     if(!topUpSent) return;
    //     setTimeout(() => {
    //         setTopUpSent(false);
    //         checkPrivateBalance();
    //     }, 15000);
    // }, [topUpSent])

    // useEffect(() => {
    //     if(publicKey) {
    //         checkPrivateBalance();
    //     }
    // }, [publicKey])

    return (
        <div style={{display:"flex", flexDirection: "column", alignContent:"center" }}>
            <h1 className={styles.anon_header_text}>Anon Funds Low?</h1>

                {/* <div style={{display:"flex", flexDirection: "row", alignContent:"center", justifyContent:"space-evenly" }}>
                    <div style={{display:"flex", flexDirection: "column", alignContent:"center", justifyContent: "center", alignItems:"center" ,width: "50%" }}>
                        
                        <button
                            className={styles.button}
                            type="submit"
                            onClick={checkPrivateBalance}
                        >
                            Check Balance
                        </button>
                        <button
                            className={styles.button}
                            type="submit"
                            onClick={topup}
                        >
                            Fund Private Wallet {topUpAmount > 0 ? topUpAmount : ''}
                        </button>
                    </div>

                    <div style={{display:"flex", flexDirection: "column", alignContent:"center", width: "50%" }}>
                        <h1 className={styles.form_header_text}>
                            Elusiv Balance: {elusivBalance ? elusivBalance : '0'} {elusivBalance > 0 ? 'SOL' : ''}
                        </h1>
                        
                        {!topUpSent ? (
                            <input 
                                style={{
                                    width: "80%",
                                    height: "30px",
                                    borderRadius: "5px",
                                    border: "1px solid #000",
                                    margin: "45px 10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    //center the text
                                    textAlign: "center",
                                    fontSize: "16px",
                                    marginBottom: "10px",
                                }} 
                                type="number" 
                                placeholder="Amount"
                                onChange={onTopUpAmountChange} 
                                name="topup" 
                                id="topup" 
                            />
                        ) : (
                            <p>Top up sent, checking balance in 15 seconds</p>
                        )}
                    </div> 
                </div> */}
        </div>
    )
}

export default ElusivSetup;