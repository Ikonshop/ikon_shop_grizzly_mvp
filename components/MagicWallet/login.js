import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";
import { CreateCollectionFromMagic, GetCollectionByEmail  } from "../../lib/api";
import {  getAssociatedTokenAddress } from "@solana/spl-token";
import Loading from "../Loading";


const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";


const LoginMagic = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [balance, setBalance] = useState(0);
  const [magicUsdcBalance, setMagicUsdcBalance] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const connection = new web3.Connection(rpcUrl);

  

  const login = async (e) => {
    e.preventDefault();
    console.log("starting login for email", email);
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
        solana: new SolanaExtension({
            rpcUrl
        })
        }
    });
    await magic.auth.loginWithMagicLink({ email });
    const userMetadata = await magic.user.getMetadata();
    localStorage.setItem('userMagicMetadata', JSON.stringify(userMetadata));
    const pubFromMetadata = new web3.PublicKey(userMetadata.publicAddress);
    getBalance(pubFromMetadata);
    getUsdcBalance(pubFromMetadata);
    window.dispatchEvent(new Event('magic-logged-in'));
    setIsLoggedIn(true);
  };

  const logout = async (e) => {
    e.preventDefault();
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: {
        solana: new SolanaExtension({
            rpcUrl
        })
        }
    });
    await magic.user.logout();
    localStorage.removeItem('userMagicMetadata');
    window.dispatchEvent(new Event('magic-logged-out'));
    setIsLoggedIn(false);
  };


    async function getBalance(pubKey) {
      const solanaMagicAddress = new web3.PublicKey(pubKey);
      const balance = await connection.getBalance(solanaMagicAddress);
      console.log('balance: ', balance)
      const convertedBalance = balance / 1000000000;
      setBalance(convertedBalance);
    }

    async function getUsdcBalance(pubKey) {
      const solanaMagicAddress = new web3.PublicKey(pubKey);
      console.log('checking for usdc balance', solanaMagicAddress.toString())
      const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
      // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
      try{
        const associatedTokenAddress = await getAssociatedTokenAddress(usdcAddress, solanaMagicAddress);
        console.log('associatedTokenAddress: ', associatedTokenAddress.toString())
        const usdcBalance = await connection.getTokenAccountBalance(associatedTokenAddress);
        console.log('usdcBalance: ', usdcBalance.value.uiAmount)
        const convertedUsdcBalance = usdcBalance.value.uiAmount;
        setMagicUsdcBalance(convertedUsdcBalance);
      } catch (error) {
        console.log('error: ', error)
      }

    }


 

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    setSendingTransaction(true);

    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
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
    setTxHash(`https://explorer.solana.com/tx/${signature}`);
    setSendingTransaction(false);
  };

  

    const renderForm = () => {
        return (
          <div 
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "200px",
            }}
          >
                {!isLoggedIn && (
                    <form 
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                        alignText: "center",
                        width: "100px",
                      
                      }}
                      onSubmit={login}>
                        {/* EMAIL */}
                        <input 
                          type="email" 
                          width="20px" 
                          onChange={(event) => {
                            setEmail(event.target.value);
                          }} 
                          name="email" 
                          required="required" 
                          placeholder="Magic Email Login" 
                          style={{
                            display: "flex",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            border: "2px solid #000000",
                            borderRadius: "100px",
                            backgroundColor: "transparent",
                            marginRight: "10px",
                            height: "40px",
                          }}
                        />
                        <button
                            className="signup_button"
                            onClick={login}
                            style={{
                              display: "flex",
                              // displace placeholder text in center of input box
                              borderRadius: "15px",
                              marginRight: "10px",
                              height: "40px",
                            }}
                        >
                            <img
                              src="/magicWand.svg"
                              alt="magicWand"
                              width="30px"
                            />
                        </button>                  
                    </form>
                )}            
            </div>
        );
    }

    const renderLogout = () => {
        return (
            <>
                {isLoggedIn && (
                    <form>
                        <button 
                            className="signup_button"
                            type="submit"
                            onClick={()=> logout()}
                        >
                            {/* use whitePeace.svg from public, size is small enough to fit inline with text on button */}
                            <img 
                              src="/blackPeace.svg" 
                              alt="blackPeace"
                              width="40px"
                            />
                            {email} 
                            
                        </button>
                        
                    </form>
                )}
            </>
        )
    }

    // useEffect to see if user is logged in
    useEffect(() => {
      if(!isLoggedIn){
        const magic = new Magic("pk_live_CD0FA396D4966FE0", {
            extensions: {
                solana: new SolanaExtension({
                rpcUrl
                })
            }
        });
        async function checkUser() {
            const loggedIn = await magic.user.isLoggedIn();
            console.log('loggedIn', loggedIn)
            if(loggedIn) {
              setIsLoggedIn(true)
              magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
                setIsLoggedIn(magicIsLoggedIn);
                  if (magicIsLoggedIn) {
                    magic.user.getMetadata().then((user) => {
                      setUserMetadata(user);
                      localStorage.setItem('userMagicMetadata', JSON.stringify(user));
                      const pubKey = new web3.PublicKey(user.publicAddress);
                      getBalance(pubKey);
                      getUsdcBalance(pubKey);
                      setEmail(user.email);
                      window.dispatchEvent(new CustomEvent("magic-logged-in"));
                    });
                  }
                });
            }
        }
        
        checkUser();
      }

    }, []);





    return (
        <div>
            {loading && <Loading />}
            {!loading && !isLoggedIn && renderForm()}
            {!loading && isLoggedIn && renderLogout()}
        </div>
    );


}

export default LoginMagic;