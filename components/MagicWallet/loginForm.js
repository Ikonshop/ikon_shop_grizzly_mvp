import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { ConnectExtension } from "@magic-ext/connect";
import { CreateCollectionFromMagic, CheckForCollectionByOwner  } from "../../lib/api";
import * as web3 from "@solana/web3.js";
import Loading from "../Loading";
import { useRouter } from "next/router";

const LoginForm = (req) => {
    const router = useRouter();
    const userName = req.userName;
    const storeName = req.storeName;
    const email = req.email;
    console.log('ready to login magic with', email, userName, storeName)
    const [userPubKey, setUserPubKey] = useState(null);
    const [publicAddress, setPublicAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    //main net
    const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";


    const handleLogin = async () => {    
        
        if (email) {
            setLoading(true);
            console.log('credentials', email, userName, storeName)
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
            window.dispatchEvent(new CustomEvent("magic-logged-in"));
            setLoggedIn(true);
            setLoading(false);
        }
    };

     

    // const renderForm = () => {
    //     return (
    //         <>
    //             {!loggedIn && (
    //                 <form onSubmit={handleLogin}>
    //                     {/* EMAIL */}
    //                     <input type="email" onChange={handleChange} name="email" required="required" placeholder="Enter your email" />
    //                     {/* NAME */}
    //                     <input type="text" name="name" onChange={handleChange} required="required" placeholder="Enter your name" />
    //                     {/* STORE NAME */}
    //                     <input type="text" name="storeName" onChange={handleChange} placeholder="Enter your store name (optional)" />
    //                     <br/>
    //                     <div className="signup_row1">
    //                         <p>
    //                         By signing up, you agree to IkonShop's{" "}
    //                         <strong>Terms of Use</strong> and{" "}
    //                         <strong>Privacy Policy</strong>
    //                         </p>
    //                         <button 
    //                             type="submit"
    //                             className="signup_button"
                            
    //                         >
    //                             Proceed
    //                         </button>
    //                     </div>
    //                 </form>
    //             )}            
    //         </>
    //     );
    // }




    return (
        <div>
            <button
                className="signup_button"
                onClick={() => {
                    handleLogin();
                }}
            >
                Magic Wallet
            </button>
        </div>
    );


}

export default LoginForm;