import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";
import { CreateCollectionFromMagic, GetCollectionByEmail  } from "../../lib/api";
import Loading from "../Loading";


const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";


const LoginMagic = () => {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});
  const [balance, setBalance] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [txHash, setTxHash] = useState("");
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const connection = new web3.Connection(rpcUrl);

  useEffect(() => {

    const magic = new Magic("pk_live_FCF04103A9172B45", {
        extensions: {
        solana: new SolanaExtension({
            rpcUrl
        })
        }
    });
    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
    setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then((user) => {
          setUserMetadata(user);
          const pubKey = new web3.PublicKey(user.publicAddress);
          getBalance(pubKey);
        });
      }
    });
  }, [isLoggedIn]);

  const login = async () => {

    const magic = new Magic("pk_live_FCF04103A9172B45", {
        extensions: {
        solana: new SolanaExtension({
            rpcUrl
        })
        }
    });
    await magic.auth.loginWithMagicLink({ email });
    const userMetadata = await magic.user.getMetadata();
    localStorage.setItem('userMagicMetadata', JSON.stringify(userMetadata));

    setIsLoggedIn(true);
  };

  const logout = async () => {

    const magic = new Magic("pk_live_FCF04103A9172B45", {
        extensions: {
        solana: new SolanaExtension({
            rpcUrl
        })
        }
    });
    await magic.user.logout();
    localStorage.removeItem('userMagicMetadata');
    setIsLoggedIn(false);
  };

  const getBalance = async (pubKey) => {
    connection.getBalance(pubKey).then((bal) => setBalance(bal / 1000000000));
  };

 

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
                    <form onSubmit={logout}>
                        <button 
                            className="signup_button"
                            type="submit"
                            onClick={logout}
                        >
                            {/* use whitePeace.svg from public, size is small enough to fit inline with text on button */}
                            <img 
                              src="/blackPeace.svg" 
                              alt="blackPeace"
                              width="40px"
                            />
                            {email}
                            Balance: {balance}
                        </button>
                    </form>
                )}
            </>
        )
    }

    // useEffect to see if user is logged in
    useEffect(() => {
    
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
                

                  const userMetadata = await magic.user.getMetadata();
                  console.log('userMetadata', userMetadata)
                  const wallet = new web3.PublicKey(userMetadata.publicAddress);
                  console.log('wallet', wallet.toString()) 
                  //set metadata to local storage
                  localStorage.setItem('userMagicMetadata', JSON.stringify(userMetadata));
                  const magicEmail = userMetadata.email;
                  const publicAddress = userMetadata.publicAddress;
                  console.log('publicAddress', publicAddress)
                  window.dispatchEvent(new CustomEvent("magic-logged-in"));
                }
            }
            checkUser();

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