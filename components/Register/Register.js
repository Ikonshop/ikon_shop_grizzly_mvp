import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles/Register.module.css";
import LoginForm from "../../components/MagicWallet/loginForm";
import dynamic from "next/dynamic";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import { CreateCollectionFromMagic, CheckForCollectionByOwner  } from "../../lib/api";
import { useRouter } from "next/router";


const Register = (req) => {
    const router = useRouter();
    const { publicKey } = useWallet();
    const userName = req.userName;
    const storeName = req.storeName;
    const email = req.email;
    console.log('userName', req.userName)
    console.log('storeName', req.storeName)
    console.log('email', req.email)
    const WalletMultiButton = dynamic(
        async () =>
          (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
        { ssr: false }
      );

    

    const handleLogin = async () => {    
        const data = JSON.stringify({
            email: email,
            owner: publicKey.toString(),
            storeName: storeName,
            name: userName
        });
        const isCollectionOwner = await CheckForCollectionByOwner(publicKey.toString());
        console.log('isCollectionOwner', isCollectionOwner)
        if (!isCollectionOwner) {
                CreateCollectionFromMagic(data);
        }
        console.log('logged in and collection created')
        router.push('/merchant/dashboard?settings=true');
    };

    useEffect(() => {
        if(publicKey) {
            handleLogin();
        }
    }, [publicKey])

    
    return (

        <div className={styles.register_modal}>
            <div className={styles.register_container}>
                <div className={styles.register_container_left}>
                    <div className={styles.register_container_left_title}>
                        Current Info
                    </div>
       
                    <div className={styles.register_container_left_data}>
                        <p><span>Name:</span> {userName}</p>
                        <p><span>Email:</span> {email}</p>
                        <p><span>Store Name:</span> {storeName != null ? storeName : null}</p>
                    </div>
                      
                </div>
                <div className={styles.register_container_right}>
                    <div className={styles.register_container_right_title}>
                        Select Merchant Wallet
                    </div>
                        <p className= {styles.sub_text}>*this is will be used to connect to the Merchant Dash and receive payments</p>
                    
                    <div className={styles.register_container_right_data}>
                      
                                
                                Email wallet using Magic:
                                <LoginForm userName={userName} storeName={storeName} email={email}/>

                                <br/>
                        
                                Browser wallet using Solana:
                                <WalletMultiButton 
                                    className="signup_button"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                />

                            
                    </div>
                </div>
            </div>
        </div>
    
    )

}

export default Register;