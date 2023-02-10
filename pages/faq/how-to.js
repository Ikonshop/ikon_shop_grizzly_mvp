import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"
import styles from "../../styles/HowTo.module.css";
import Header from "../../components/Header";


function HowTo(){
    const router = useRouter();
    return (
        <>
        <div className={styles.info_container}>
            <div className={styles.banner_hero}>
                <div className={styles.hero_text}>
                    <h3>IKONSHOP </h3>
                    <h6>Get Started Below</h6>
                    {/* <button className={styles.hero_button} onClick={() => router.push("/faq/how-to")}>
                        Click Here
                    </button> */}
                </div>
                <div className={styles.hero_overlay}></div>
                 {/* <img className={styles.banner_image} src="https://bafybeiekeeb3gushrz4evydundxohm7erxtiorqefb62zdfoo2ziicmofa.ipfs.dweb.link/bannerIkon.png" alt="emoji" /> */}
            </div>
        </div>
        <div className={styles.info_items_container}>
            PAGE COMING SOON!
            Join the Discord or ask on Twitter.
            {/* <div className={styles.info_blob}>
                <h1>How to Shop</h1>
                <p>
                    In order to make a purchase on the site you must have a Solana Wallet.
                    We are currently compatible with the following wallets:<br />
                    <ul>
                        <li>Phantom Wallet</li>
                        <li>Glow Wallet</li>
                        <li>Slope Wallet</li>
                        <li>Solflare Wallet</li>
                        <li>Torus Wallet</li>
                    </ul>
                </p>
            </div>
            <div className={styles.info_blob}>
                <h1>How to be a merchant</h1>
                <p>
                    You becoming a merchant is an exclusive benefit that provides a streamlined way to get your goods and services to your consumer.<br /><br /> 
                    You becoming a merchant is a partnership to us and we don't invite everyone. We are currently cosidering merchants who fill out this form: *insert link*<br />
                </p>
            </div>
            <div className={styles.info_blob}>
                <h1>How to Create a Product</h1>
                <p>
                    To create a product head to your merchant dashboard and select the 'Create Product' image.
                    From there you will be taken to a page where you can:
                    <ul>
                        <li>Upload a file<br />(downloadable after purchase)</li>
                        <li>Set the Product Name</li>
                        <li>Set the Price</li>
                        <li>Select the Token for payment<br />(we suggest USDC to prevent fluctuation)<br /></li>
                        <li>Set the Quantity Available<br />(defaults to 100 if blank)</li>
                        <li>Set the Product Image<br />(this is what displays in the store, make sure the link ends in  a '.png' or '.jpeg')</li>
                        <li>Set the Description<br />(tell everyone in detail what you product or service is)</li>

                    </ul>
                </p>
            </div>
            <div className={styles.info_blob}>
                <h1>How to get an ikon NFT</h1>
                <p>
                    ikon NFT's have yet to mint. Once minted they will be available on secondary markets.<br /><br />
                    Join our Discord and follow us on Twitter to stay up to date on mint dates!
                </p>
            </div> */}
        </div>
        </>
    )

}

export default HowTo