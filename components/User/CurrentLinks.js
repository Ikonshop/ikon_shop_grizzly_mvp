import React, { useState, useEffect } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../../styles/Merchant.module.css";
import Loading from "../../components/Loading";
// USER COMPONENTS
import PayRequests from "../../components/Merchant/PayRequests";
import { getCollectionOwner } from "../../lib/api";
import * as web3 from "@solana/web3.js";

config.autoAddCss = false;

function CurrentLinks() {
  const [loading, setLoading] = useState(null);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [userPublicKey, setUserPublicKey] = useState(null);
  const { publicKey, connected } = useWallet();
  const [userLinks, setUserLinks] = useState([]);
  const [userTipJar, setUserTipJar] = useState([]);

  const renderLoading = () => <Loading />;

  const renderDisplay = () => (
    <div className={styles.dashboard_container}>
      {userLinks.length > 0 && !loading ? (
      <PayRequests publicKey={userPublicKey}/>
      ) : (
        null
      )}
    </div>
  );

  useEffect(() => {
    if (publicKey) {
      // checkOwnership();
      setUserPublicKey(publicKey.toString());
      const owner = publicKey.toString();
      const getAllProducts = async () => {
        const products = await getCollectionOwner(owner);
        for (let i = 0; i < products.products.length; i++) {
          if (products.products[i].type === "link") {
            userLinks.push(products.products[i]);
          }
          if (products.products[i].type === "tipjar") {
            userTipJar.push(products.products[i]);
          }
          if (products.products[i].type === "product") {
            ownerProducts.push(products.products[i]);
          }
          if (i === products.products.length - 1) {
            setLoading(false);
          }
        }
      };
      getAllProducts();
    }
    if(!publicKey) {
      const checkMagicLogin = async () => {
        if (localStorage.getItem("userMagicMetadata")) {
          const userMagicMetadata = JSON.parse(
            localStorage.getItem("userMagicMetadata")
          );
          const magicPubKey = new web3.PublicKey(
            userMagicMetadata.publicAddress
          );
          setUserPublicKey(magicPubKey.toString());
          const getAllProducts = async () => {
            const products = await getCollectionOwner(magicPubKey.toString());
            for (let i = 0; i < products.products.length; i++) {
              if (products.products[i].type === "link") {
                userLinks.push(products.products[i]);
              }
              if (products.products[i].type === "tipjar") {
                userTipJar.push(products.products[i]);
              }
              if (products.products[i].type === "product") {
                ownerProducts.push(products.products[i]);
              }
              if (i === products.products.length - 1) {
                setLoading(false);
              }
            }
          };
          getAllProducts();
        }
      };
      checkMagicLogin();
    }
  }, [publicKey]);

  return (
    <div className={styles.parent_container}>
      <div className={styles.main_container}>
        {publicKey && loading ? renderLoading() : null}
        {!loading 
          ? renderDisplay()
          : null}
        
      </div>
    </div>
  );
}
export default CurrentLinks;
