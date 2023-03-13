import React, { useState, useEffect } from "react";
import styles from "../Merchant/styles/StoreSettings.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, GetAccountInfoConfig } from "@solana/web3.js";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import {
  getCollectionOwner,
  updateCollectionInfo,
  GetStoreInfo,
  GenerateAPIKey,
} from "../../lib/api";
import {
  IoGlobeOutline,
  IoLogoDiscord,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoWebComponent,
  IoCheckmarkDoneSharp,
  IoLogoGoogle,
  IoEyeOffOutline,
  IoCopy,
  IoCopyOutline,
} from "react-icons/io5";
import {
  verifyMerchantWithDiscord,
  verifyMerchantWithGoogle,
} from "../../hooks/verify";
import * as web3 from "@solana/web3.js";

const StoreSettings = () => {
  const connection = new Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );
  const { publicKey } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
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
  const [verified, setVerified] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [hideKey, setHideKey] = useState(true);
  const [newCollectionInfo, setNewCollectionInfo] = useState({
    id: "null",
    projectName: "null",
    description: "null",
    banner: "null",
    website: "null",
    twitterHandle: "null",
    instagramHandle: "null",
    discordServer: "null",
    email: "null",
    verified: false,
  });

  const handleVerifyMerchantWithDiscord = async () => {
    const response = await verifyMerchantWithDiscord();
    console.log("response from social login", response);
  };

  const handleVerifyMerchantWithGoogle = async () => {
    const response = await verifyMerchantWithGoogle();
    console.log("response from social login", response);
  };

  const handleGenerateAPIKey = async () => {
    const response = await GenerateAPIKey(userPublicKey);
    console.log("response from generate api key", response);
    setApiKey(response);
  };

  const renderApiKey = () => {
    return (
      <>
        {hideKey ? (
          <div className={styles.short_input}>
            <div
              className={styles.short_input}
              onClick={() => setHideKey(false)}
            >
              <p>
                ******** <IoEyeOffOutline />
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.short_input}>
            <div className={styles.short_input}>
              <p>
                {apiKey.slice(0, 4)}..{apiKey.slice(-4)}{" "}
                <IoEyeOffOutline onClick={() => setHideKey(true)} />{" "}
                <IoCopyOutline
                  onClick={() => window.navigator.clipboard.writeText(apiKey)}
                />
              </p>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderApiKeyDisplay = () => {
    return (
      <div className={styles.info_item}>
        <h6>API Key</h6>
        {verified ? (
          <>
            {apiKey ? (
              renderApiKey()
            ) : (
              <button
                className={styles.generate_btn}
                onClick={() => handleGenerateAPIKey()}
              >
                Generate API Key
              </button>
            )}
          </>
        ) : (
          "Must Verify Account"
        )}
      </div>
    );
  };

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
            >
              Preview
            </button>
            <div className={styles.banner_img_overlay}></div>
            <img
              className={
                !previewBanner
                  ? styles.banner_img_blur
                  : styles.banner_img_no_blur
              }
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
                <h6>Banner </h6>
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
                <div className={styles.info_item_verify}>
                  <h6>Email</h6>
                  <span className={styles.info_item_span}>
                    {verified ? (
                      "Verified"
                    ) : (
                      <>
                        {" "}
                        <span>Verify with:</span>
                        <div className={styles.info_item_verify_icons}>
                          <span
                            className={styles.info_item_verify_icon}
                            onClick={() => handleVerifyMerchantWithDiscord()}
                          >
                            {" "}
                            <IoLogoDiscord />
                          </span>
                          <span
                            className={styles.info_item_verify_icon}
                            onClick={() => handleVerifyMerchantWithGoogle()}
                          >
                            {" "}
                            <IoLogoGoogle />
                          </span>
                        </div>
                      </>
                    )}
                  </span>
                </div>
                <input
                  className={styles.short_input}
                  type="text"
                  placeholder={storeInfo.email}
                  onChange={(e) =>
                    setNewCollectionInfo({
                      ...newCollectionInfo,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              {renderApiKeyDisplay()}
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
          <h3>Uh oh error, <br />have you registerd as a Merchant?</h3>
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
            onClick={() => (
              setLoading(true),
              updateCollectionInfo(newCollectionInfo).then(() => {
                setLoading(false);
                setConfirmationModal(false);
              })
            )}
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

  const checkMagicLogin = async () => {
    if (localStorage.getItem("userMagicMetadata")) {
      const userMagicMetadata = JSON.parse(
        localStorage.getItem("userMagicMetadata")
      );
      setUserEmail(userMagicMetadata.email);
      const magicPubKey = new web3.PublicKey(userMagicMetadata.publicAddress);
      setCurrentWallet(magicPubKey.toString());
      setUserPublicKey(magicPubKey.toString());

      setLoading(false);
    }
  };

  //add window event listener for if the user changes active_store in the local storage
  useEffect(() => {
    setLoading(true);
    const new_active_store = JSON.parse(localStorage.getItem("active_store"));
    setActiveStoreSymbol(new_active_store);
    console.log("new active store", new_active_store);
    //get the store info
    if (userPublicKey) {
      (async () => {
        const store_info = await getCollectionOwner(userPublicKey);
        console.log(store_info);
        setStoreInfo(store_info.collections[0]);
        setNewCollectionInfo(store_info.collections[0]);
        if (store_info.wallets[0].apiKey != null) {
          setApiKey(store_info.wallets[0].apiKey.key);
        }
        setIsOwner(true);
        setLoading(false);
      })();
    }
    window.addEventListener("active_store_changed", () => {
      setLoading(true);
      const new_active_store = localStorage.getItem("active_store");

      setActiveStoreSymbol(new_active_store);
      (async () => {
        const store_info = await getCollectionOwner(userPublicKey);
        console.log(store_info);
        setStoreInfo(store_info);
        setNewCollectionInfo(store_info);
        setIsOwner(true);
        setLoading(false);
      })();
    });
  }, [userPublicKey]);

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

  useEffect(() => {
    if (publicKey) {
      setUserPublicKey(publicKey);
      setCurrentWallet(publicKey);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      checkMagicLogin();
    }
    window.addEventListener("magic-logged-in", () => {
      checkMagicLogin();
    });
    window.addEventListener("magic-logged-out", () => {
      setUserEmail(null);
      setUserPublicKey(null);
      setCurrentWallet(null);
      localStorage.removeItem("userMagicMetadata");
    });
  }, []);

  useEffect(() => {
    if (userPublicKey) {
      console.log("window.location.pathname", userPublicKey);
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const magic = new Magic("pk_live_CD0FA396D4966FE0", {
        extensions: [new OAuthExtension()],
      });
      if (urlParams.get("discordVerify") === "true") {
        console.log("userSettings=true");

        async function handleVerifyWithSocial() {
          const store_info = await getCollectionOwner(userPublicKey);
          console.log("store info", store_info);
          const result = await magic.oauth.getRedirectResult();
          const profile = JSON.stringify(result.oauth.userInfo, undefined, 2);
          console.log("profile", profile);
          const email = result.oauth.userInfo.email;
          const isVerified = result.oauth.userInfo.emailVerified;
          setVerified(isVerified);
          const name =
            result.oauth.userInfo.sources[`https://discord.com/api/users/@me`]
              .username;
          // setUserName(name);
          const data = {
            ...newCollectionInfo,
            id: store_info.collections[0].id,
            banner: store_info.collections[0].banner,
            description: store_info.collections[0].description,
            verified: isVerified,
            email: email,
          };
          const update = await updateCollectionInfo(data);
          console.log("update", update);
        }
        handleVerifyWithSocial();
      }
      if (urlParams.get("googleVerify") === "true") {
        console.log("userSettings=true");
        async function handleVerifyWithSocial() {
          const store_info = await getCollectionOwner(userPublicKey);
          console.log("store info", store_info);
          const result = await magic.oauth.getRedirectResult();
          const profile = JSON.stringify(result.oauth.userInfo, undefined, 2);
          console.log("profile", profile);
          const email = result.oauth.userInfo.email;
          const isVerified = true;
          setVerified(isVerified);
          const name = result.oauth.userInfo.name;
          // setUserName(name);
          const data = {
            ...newCollectionInfo,
            id: store_info.collections[0].id,
            banner: store_info.collections[0].banner,
            description: store_info.collections[0].description,
            verified: isVerified,
            email: email,
          };
          const update = await updateCollectionInfo(data);
          console.log("update", update);
          setVerified(update.updateCollection.verified);
          setUserEmail(update.updateCollection.email);
        }
        handleVerifyWithSocial();
      }
    }
  }, [userPublicKey]);

  return (
    <div>
      {userPublicKey && isOwner && !loading && !confirmationModal
        ? renderStoreSettings()
        : null}
      {confirmationModal ? renderConfirmationModal() : null}
    </div>
  );
};

export default StoreSettings;
