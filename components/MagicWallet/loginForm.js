import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { ConnectExtension } from "@magic-ext/connect";
import { CreateCollectionFromMagic, CheckForCollectionByOwner  } from "../../lib/api";
import * as web3 from "@solana/web3.js";
import Loading from "../Loading";

const LoginForm = () => {
    const { Magic } = require('magic-sdk');
    const [userName, setUserName] = useState(null);
    const [storeName, setStoreName] = useState(null);
    const [email, setEmail] = useState(null);
    const [userPubKey, setUserPubKey] = useState(null);
    const [publicAddress, setPublicAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    //main net
    const rpcUrl = "https://api.mainnet-beta.solana.com";

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setUserName(value);
        } else if (name === "storeName") {
            setStoreName(value);
        } else if (name === "email") {
            setEmail(value);
        }
    };


    const handleLogin = async (e) => {
        // const magic = new Magic("pk_test_816925B318CC2CA0");
        const magic = new Magic("pk_live_CD0FA396D4966FE0", {
            extensions: {
                solana: new SolanaExtension({
                rpcUrl
                })
            }
            });
            
        e.preventDefault();
        
        if (email) {
            setLoading(true);
            console.log('credentials', email, userName, storeName)
            await magic.auth.loginWithMagicLink({ email });
            
            const userMetadata = await magic.user.getMetadata();
            console.log('userMetadata', userMetadata)
            //set metadata to local storage
                localStorage.setItem('userMagicMetadata', JSON.stringify(userMetadata));
            const magicEmail = userMetadata.email;
            const publicAddress = userMetadata.publicAddress;
            console.log('publicAddress', publicAddress)
            const pubKey = new web3.PublicKey(publicAddress); 

            console.log('pubKey', pubKey.toString())
            setEmail(magicEmail);
            setUserPubKey(pubKey);
            setPublicAddress(pubKey.toString());
            const data = JSON.stringify({
                email: magicEmail,
                owner: pubKey.toString(),
                storeName: storeName,
                name: userName
            });
            const isCollectionOwner = await CheckForCollectionByOwner(pubKey.toString());
            console.log('isCollectionOwner', isCollectionOwner)
            if (!isCollectionOwner) {
                CreateCollectionFromMagic(data);
            }
            window.dispatchEvent(new CustomEvent("magic-logged-in"));
            setLoggedIn(true);
            setLoading(false);
        }
    };

     

      /* Implement Logout Handler */
    const handleLogout = async () => {
        const magic = new Magic("pk_live_CD0FA396D4966FE0", {
            extensions: {
                solana: new SolanaExtension({
                rpcUrl
                })
            }
            });
        await magic.user.logout();
        localStorage.setItem("userMagicMetadata", "")
        window.dispatchEvent(new CustomEvent("magic-logged-out"));
        setLoggedIn(false);
    };

    const renderForm = () => {
        return (
            <>
                {!loggedIn && (
                    <form onSubmit={handleLogin}>
                        {/* EMAIL */}
                        <input type="email" onChange={handleChange} name="email" required="required" placeholder="Enter your email" />
                        {/* NAME */}
                        <input type="text" name="name" onChange={handleChange} required="required" placeholder="Enter your name" />
                        {/* STORE NAME */}
                        <input type="text" name="storeName" onChange={handleChange} placeholder="Enter your store name (optional)" />
                        <br/>
                        <div className="signup_row1">
                            <p>
                            By signing up, you agree to IkonShop's{" "}
                            <strong>Terms of Use</strong> and{" "}
                            <strong>Privacy Policy</strong>
                            </p>
                            <button 
                                type="submit"
                                className="signup_button"
                            >
                                Proceed
                            </button>
                        </div>
                    </form>
                )}            
            </>
        );
    }

    const renderLogout = () => {
        return (
            <>
                {loggedIn && (
                    <form onSubmit={handleLogout}>
                        <p>Current email: {email}</p>
                        <button 
                            className="signup_button"
                            type="submit"
                        >
                            Logout
                        </button>
                    </form>
                )}
            </>
        )
    }

    useEffect(() => {
        if(window) {
            setLoading(false);
        }
        async function getUser() {
            const magic = new Magic("pk_live_CD0FA396D4966FE0", {
                extensions: {
                    solana: new SolanaExtension({
                    rpcUrl
                    })
                }
            });

            const m = new Magic("pk_live_CB4B9F5B4EC9A741", {
                extensions: {
                    solana: new SolanaExtension({
                    rpcUrl
                    })
                }
            });
        }
        getUser();
    }, []);



    return (
        <div>
            {loading && <Loading />}
            {!loading && !loggedIn && renderForm()}
            {!loading && loggedIn && renderLogout()}
        </div>
    );


}

export default LoginForm;