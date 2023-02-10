import React, { useState, useEffect } from "react";
import styles from "../Merchant/styles/StoreSettings.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, GetAccountInfoConfig } from "@solana/web3.js";
import {
  getCollectionOwner,
  updateCollectionInfo,
  GetStoreInfo,
} from "../../lib/api";
import {
  IoGlobeOutline,
  IoLogoDiscord,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoWebComponent,
} from "react-icons/io5";

const StoreSettings = () => {
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);
  const [activeStoreSymbol, setActiveStoreSymbol] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);
  const [storeSelectionNeeded, setStoreSelectionNeeded] = useState(true);
  const [storeProducts, setStoreProducts] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isMultiStoreOwner, setIsMultiStoreOwner] = useState(false);
  const [multiStoreArray, setMultiStoreArray] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(false);
  const [newCollectionInfo, setNewCollectionInfo] = useState({
    id: "null",
    projectName: "null",
    description: "null",
    banner: "null",
    website: "null",
    twitterHandle: "null",
    instagramHandle: "null",
    discordServer: "null",
  });

  const renderStoreSettings = () => {
    console.log("storeInfo: ", storeInfo);
    if (storeInfo && !loading) {
      return (
        <div className={styles.settings_container}>
          <h3>{storeInfo.projectName}</h3>
          <div className={styles.banner_img}>
            <button
              // if button is hovered over trigger previewBanner state change
              onMouseEnter={() => setPreviewBanner(true)}
              onMouseLeave={() => setPreviewBanner(false)}
            >Preview</button>
            <div className={styles.banner_img_overlay}></div>
            <img

              className={!previewBanner ? styles.banner_img_blur : styles.banner_img_no_blur } 
              src={storeInfo.banner} 
            />
          </div>

          <div className={styles.settings_info_container}>
            <div className={styles.settings_column}>
              <div className={styles.info_item}>
                <h6>Project Name</h6>
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.projectName}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      projectName: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.info_item}>
                <h6>Banner URL</h6>
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.banner}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      banner: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.info_item}>
                <h6>Description</h6>
                <textarea
                  className={styles.long_input}
                  type="text"
                  placeholder={storeInfo.description}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.settings_column}>
              <div className={styles.info_item}>
                <IoGlobeOutline color={"#130b46"} height="20px" width="20px" />
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.website}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      website: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.info_item}>
                <IoLogoTwitter color={"#130b46"} height="20px" width="20px" />
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.twitterHandle}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      twitterHandle: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.info_item}>
                <IoLogoInstagram color={"#130b46"} height="20px" width="20px" />
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.instagramHandle}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      instagramHandle: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.info_item}>
                <IoLogoDiscord color={"#130b46"} height="20px" width="20px" />
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.discordServer}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      discordServer: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <button
            className={styles.update_button}
            onClick={() => setConfirmationModal(true)}
          >
            Update Store Info
          </button>
        </div>
      );
    } else {
      // Please select a store to edit
      return (
        <div className={styles.settings_container}>
          <h3>Please select a store to edit</h3>
        </div>
      );
    }
  };

  // render a confirmation modal that asks if you want to update the store settings and displays the new settings
  const renderConfirmationModal = () => {
    return (
      <div className={styles.settings_container}>
        <h3>Confirm Update</h3>
        <div>
          <img
            src={newCollectionInfo.banner}
            alt={newCollectionInfo.projectName}
            style={{
              width: "200px",

              borderRadius: "20px",
            }}
          />

          <h4>{newCollectionInfo.projectName}</h4>
          <p>{newCollectionInfo.description}</p>

          <div className={styles.social_links}>
            <div>
              <IoGlobeOutline color={"#130B46"} height="30px" width="30px" />
              <a href={newCollectionInfo.website} target="_blank">
                {newCollectionInfo.website}
              </a>{" "}
            </div>
            <div>
              <IoLogoTwitter color={"#130B46"} height="30px" width="30px" />
              <a href={newCollectionInfo.twitterHandle} target="_blank">
                {newCollectionInfo.twitterHandle}
              </a>{" "}
            </div>
            <div>
              <IoLogoInstagram color={"#130B46"} height="30px" width="30px" />
              <a href={newCollectionInfo.instagramHandle} target="_blank">
                {newCollectionInfo.instagramHandle}
              </a>{" "}
            </div>
            <div>
              <IoLogoDiscord color={"#130B46"} height="30px" width="30px" />
              <a href={newCollectionInfo.discordServer} target="_blank">
                {newCollectionInfo.discordServer}
              </a>{" "}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <button
            className={styles.update_button}
            onClick={() => updateCollectionInfo(newCollectionInfo)}
          >
            Update
          </button>
          <button
            className={styles.cancel_button}
            onClick={() => setConfirmationModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  //add window event listener for if the user changes active_store in the local storage
  useEffect(() => {
    setLoading(true);
    const new_active_store = JSON.parse(localStorage.getItem("active_store"));
    setActiveStoreSymbol(new_active_store);
    console.log("new active store", new_active_store);
    //get the store info
    (async () => {
      const store_info = await GetStoreInfo();
      console.log(store_info);
      setStoreInfo(store_info);
      setNewCollectionInfo(store_info);
      setIsOwner(true);
      setLoading(false);
    })();
    window.addEventListener("active_store_changed", () => {
      setLoading(true);
      const new_active_store = localStorage.getItem("active_store");

      setActiveStoreSymbol(new_active_store);
      (async () => {
        const store_info = await GetStoreInfo();
        console.log(store_info);
        setStoreInfo(store_info);
        setNewCollectionInfo(store_info);
        setIsOwner(true);
        setLoading(false);
      })();
    }); 
  }, []);

  //add window event listener for if the user changes active_store in the local storage
  //   useEffect(() => {
  //     window.addEventListener("active_store_changed", () => {
  //       console.log("active store changed");
  //       setLoading(true);
  //       const new_active_store = localStorage.getItem("active_store");
  //       console.log("new active store", new_active_store);
  //       setActiveStoreSymbol(new_active_store);
  //       (async () => {
  //         const store_info = await GetStoreInfo();

  //                 setStoreInfo(store_info);
  //                 setNewCollectionInfo(store_info);
  //                 setIsOwner(true);
  //                 setLoading(false);
  //             })();
  //         });
  //         setLoading(false);
  //         console.log('loading: ' + loading)
  //         console.log('is owner: ' + isOwner)

  //     }, []);

  return (
    <div>
      {publicKey &&
      isOwner &&
      !loading &&
      !confirmationModal &&
      activeStoreSymbol
        ? renderStoreSettings()
        : null}
      {confirmationModal ? renderConfirmationModal() : null}
    </div>
  );
};

export default StoreSettings;
