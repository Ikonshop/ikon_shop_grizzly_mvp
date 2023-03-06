import React, { useState, useEffect } from "react";
import { GetWalletProfile, fetchProducts, getSingleProductBySku } from "../../lib/api";
import Profile from "../../components/Profile/Profile";
import styles from "../../styles/ProductDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Buy from "../../components/Buy";
import { useWallet } from "@solana/wallet-adapter-react";
// import Head from "next/head";
import Loading from "../../components/Loading";
import PaylinkComponent from "../../components/Paylink";
import { useRouter } from "next/router";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";
import { render } from "react-dom";


export default function SingleProductViewer({}) {
    const { publicKey, connected } = useWallet();
    const [userPublicKey, setUserPublicKey] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [walletProfile, setWalletProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
    const connection = new web3.Connection(rpcUrl);

    const renderProfilePage = () => {
        return (
            <Profile data={walletProfile} />
        );
    };

    useEffect(() => {
        if (publicKey) {
        setUserPublicKey(publicKey);
        }
    }, [publicKey]);

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
                magic.user.getMetadata().then((user) => {
                    const pubKey = new web3.PublicKey(user.publicAddress);
                    setUserPublicKey(pubKey);
                    setUserEmail(user.email);
                });
            }
        }
            checkUser();
    }, []);

    useEffect(() => {
        // grab the url
        const url = window.location.href.slice(-44);
        console.log("url", url);
        async function getWalletProfile() {
            const walletProfile = await GetWalletProfile(url);
            console.log("walletProfile", walletProfile);
            setWalletProfile(walletProfile);
            setLoading(false);
        }
        getWalletProfile();
    }, []);
    return (
        <>
            {loading ? <Loading /> : null}
            {!loading && walletProfile ? renderProfilePage() : null}
        
        </>
    );
}

// Specify dynamic routes to pre-render pages based on data.
// The HTML is generated at build time and will be reused on each request.
export async function getStaticProps({ params }) {
  const data = await getSingleProductBySku(params.slug);
  return {
    props: {
      product: data,
    },
  };
}

export async function getStaticPaths() {
  const data = await fetchProducts("ABC");
  const paths = data.map((product) => ({
    params: {
      slug: product.id,
    },
  }));
  return {
    paths,
    fallback: true,
  };
}
