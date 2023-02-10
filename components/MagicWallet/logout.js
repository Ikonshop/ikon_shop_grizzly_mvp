import React, { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import { ConnectExtension } from "@magic-ext/connect";
import { CreateCollectionFromMagic, GetCollectionByEmail  } from "../../lib/api";
import { useRouter } from "next/router";
import * as web3 from "@solana/web3.js";
import Loading from "../Loading";

//create logoit

const LogoutMagic = ()  => {
    const { Magic } = require('magic-sdk');
    const router = useRouter();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    //main net
    const rpcUrl = "https://api.mainnet-beta.solana.com";

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
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
        localStorage.setItem("userMagicMetadata", null);
        window.dispatchEvent(new CustomEvent("magic-logged-out"));
        setLoggedIn(false);
    };


    
   
    const renderLogout = () => {
        return (
            <>
                {loggedIn && (
                    <form onSubmit={handleLogout}>
                        <button 
                            className="signup_button"
                            type="submit"
                        >
                            {/* use whitePeace.svg from public, size is small enough to fit inline with text on button */}
                            <img 
                              src="/blackPeace.svg" 
                              alt="blackPeace"
                              width="40px"
                            />
                            Logout22
                        </button>
                    </form>
                )}
            </>
        )
    }

    return (
        <div>
            {renderLogout()}
        </div>
    )

}

export default LogoutMagic;
// Path: components/MagicWallet/login.js