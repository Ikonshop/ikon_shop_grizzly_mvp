import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./styles/Profile.module.css";
import {
  GetWalletSettings,
  UpdateWalletSettings,
  UpsertWallet,
} from "../../lib/api";
import {
  IoArrowForwardOutline,
  IoLinkOutline,
  IoPencilSharp,
  IoNotificationsSharp,
  IoShieldCheckmarkSharp,
  IoPencil,
  IoCamera,
  IoCheckmarkDoneSharp,
  IoLogoGoogle,
  IoLogoDiscord,
} from "react-icons/io5";
import LoginMagic from "../MagicWallet/login";
import { verifyWithDiscord, verifyWithGoogle } from "../../hooks/verify";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";

const Profile = (userPubKey) => {
  // DASH STATES
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showConnectivity, setShowConnectivity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordAndSecurity, setShowPasswordAndSecurity] = useState(false);

  const [activeDash, setActiveDash] = useState("Edit Profile");

  const handleVerifyWithDiscord = async () => {
    const response = await verifyWithDiscord();
    console.log("response from social login", response);
  };

  const handleVerifyWithGoogle = async () => {
    const response = await verifyWithGoogle();
    console.log("response from social login", response);
  };

  // PROFILE IMAGE UPLOAD

  // const handleImageUpload = async (e) => {
  //   const form = new FormData();
  //   const file = e.target.files[0];
  //   form.append('operations', JSON.stringify({
  //     query: `
  //       mutation ($file: Upload!) {
  //         uploadFile(file: $file) {
  //           id
  //           url
  //         }
  //       }
  //     `,
  //     variables: {
  //       file: null,
  //     },
  //   }));

  //   form.append('map', JSON.stringify({
  //     0: ['variables.file'],
  //   }));

  //   form.append(0, file, file.name);

  //   const response = await fetch(process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT_UPLOAD, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`,
  //     },
  //     body: form,
  //   });

  //   const { data, errors } = await response.json();

  //   console.log('data returned:', data);

  //   if (errors) {
  //     console.error(errors);
  //     return;
  //   }
  // };

  // PROFILE DATA
  const [userName, setUserName] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [description, setDescription] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [cryptoLinks, setCryptoLinks] = useState(null);
  const [verified, setVerified] = useState(false);

  const [loading, setLoading] = useState(true);
  const [imageToUpload, setImageToUpload] = useState(null);

  const req = useMemo(() => {
    return {
      userPubKey: userPubKey,
      email: email,
      name: userName,
      description: description,
      // profileImage: profileImage,
      socialLinks: socialLinks,
      cryptoLinks: cryptoLinks,
      verified: verified,
    };
  }, [userPubKey, email, userName, description, socialLinks, cryptoLinks]);

  const renderEditProfile = () => {
    return (
      <div className={styles.edit_profile_container}>
        <div className={styles.profile_header}>
          <h1>Edit Profile</h1>
        </div>
        <div className={styles.profile_body}>
          <div className={styles.profile_body_right}>
            <div className={styles.profile_image_container}>
              <div className={styles.profile_image}>
                {/* <div
                  style={{
                    position: "absolute",
                    bottom: "-7px",
                    right: "0",
                    width: "35px",
                    height: "35px",
                    background: "#14D19E",
                    borderRadius: "50%",
                    zIndex: "20",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <IoCamera
                    style={{
                      fontSize: "20px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  />
                </div> */}
                <img
                  src={
                    profileImage != null ? profileImage : "/user_phantom.png"
                  }
                />
              </div>
            </div>
            <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_right_bottom_left}>
                <p>Name</p>
                <input
                  type="text"
                  className={styles.profile_body_right_input}
                  placeholder={userName ? userName : "Name"}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className={styles.profile_body_right_bottom_right}>
                <p>
                  Email <span>{verified ? "Verified" : "Unverified"}</span>
                </p>
                <input
                  type="text"
                  className={styles.profile_body_right_input}
                  placeholder={email ? email : "Email"}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {!verified && (
                  <>
                    <p>
                      Verify with:
                      <span
                        style={{ color: "#14D19E", cursor: "pointer" }}
                        onClick={() => handleVerifyWithDiscord()}
                      >
                        {" "}
                        <IoLogoDiscord />
                      </span>
                      <span
                        style={{ color: "#14D19E", cursor: "pointer" }}
                        onClick={() => handleVerifyWithGoogle()}
                      >
                        {" "}
                        <IoLogoGoogle />
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <br />
            <div className={styles.profile_description}>
              <p>Description</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder={description ? description : "Description"}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.profile_link_list}>
              <p>Social Links</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder="Social links, separated by a comma"
                onChange={(e) => setSocialLinks(e.target.value)}
              />
            </div>
            <div className={styles.profile_link_list}>
              <p>Crypto Links</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder="Crypto links, separated by a comma"
                onChange={(e) => setCryptoLinks(e.target.value)}
              />
            </div>
            {/* <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_image_input}>
                <p>Profile Picture</p>
                <input 
                  type="file" 
                  name="file"
                  onChange={(e) => (
                    setImageToUpload(e.target.files[0]),
                    handleImageUpload(e),
                    console.log("image to upload", e.target.files[0])
                  )}
                />
              </div>
            </div> */}
            <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_update}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    console.log("req", req);
                    UpdateWalletSettings(req);
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectivity = () => {
    return (
      <div>
        <h1>Connectivity</h1>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div>
        <h1>Notifications</h1>
      </div>
    );
  };

  const renderPasswordAndSecurity = () => {
    return (
      <div>
        <h1>Password & Security</h1>
      </div>
    );
  };

  const renderCurrentMenu = () => {
    if (activeDash === "Edit Profile") {
      return renderEditProfile();
    } else if (activeDash === "Connectivity") {
      return renderConnectivity();
    } else if (activeDash === "Notifications") {
      return renderNotifications();
    } else if (activeDash === "Password & Security") {
      return renderPasswordAndSecurity();
    }
  };

  useEffect(() => {
    setWalletAddress(userPubKey.userPubKey);
    const getWalletSettings = async () => {
      try {
        setLoading(true);
        const response = await GetWalletSettings(userPubKey);
        console.log("get wallet settings resp", response);
        setEmail(response.email != null ? response.email : "");
        setUserName(response.name != null ? response.name : "");
        setProfileImage(
          response.profileImage != null ? response.profileImage.url : ""
        );
        setDescription(
          response.description != null ? response.description : ""
        );
        setSocialLinks(
          response.socialLinks != null ? response.socialLinks : []
        );
        setCryptoLinks(
          response.cryptoLinks != null ? response.cryptoLinks : []
        );
        setVerified(response.verified);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getWalletSettings();
  }, []);

  useEffect(() => {
    console.log("window.location.pathname", userPubKey);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const magic = new Magic("pk_live_CD0FA396D4966FE0", {
      extensions: [new OAuthExtension()],
    });
    if (urlParams.get("discordVerify") === "true") {
      console.log("userSettings=true");
      async function handleVerifyWithSocial() {
        const result = await magic.oauth.getRedirectResult();
        const profile = JSON.stringify(result.oauth.userInfo, undefined, 2);
        console.log("profile", profile);
        const email = result.oauth.userInfo.email;
        const isVerified = result.oauth.userInfo.emailVerified;
        setVerified(isVerified);
        const name =
          result.oauth.userInfo.sources[`https://discord.com/api/users/@me`]
            .username;
        setUserName(name);
        const data = JSON.stringify({
          email: email,
          name: name,
          owner: userPubKey.userPubKey,
          verified: isVerified,
        });

        UpsertWallet(data);
      }
      handleVerifyWithSocial();
    }
    if (urlParams.get("googleVerify") === "true") {
      console.log("userSettings=true");
      async function handleVerifyWithSocial() {
        const result = await magic.oauth.getRedirectResult();
        const profile = JSON.stringify(result.oauth.userInfo, undefined, 2);
        console.log("profile", profile);
        const email = result.oauth.userInfo.email;
        const isVerified = true;
        setVerified(isVerified);
        const name = result.oauth.userInfo.name;
        setUserName(name);
        const data = JSON.stringify({
          email: email,
          name: name,
          owner: userPubKey.userPubKey,
          verified: isVerified,
        });

        UpsertWallet(data);
      }
      handleVerifyWithSocial();
    }
  }, []);

  return (
    <div className={styles.profile_container}>
      {/* container with profile dash on left and current menu on right */}
      {/* dash will contain the following options: Edit Profile, Connectivity, Notifications, Password & Security */}
      {/* when selected, that option becomes the current menu on right */}
      {/* active Dash will have <IoArrowForwardOutline /> next to it */}

      {/* <div className={styles.profile_header_dash}> */}
      {/* <div className={styles.profile_header_dash_item}>
          <IoPencilSharp className={styles.profile_header_dash_item_icon} />
          <p
            onClick={() => (
              setShowEditProfile(true), setActiveDash("Edit Profile")
            )}
          >
            Edit Profile
          </p>
          {activeDash === "Edit Profile" && (
            <IoArrowForwardOutline
              className={styles.profile_header_dash_item_icon}
            />
          )}
        </div> */}
      {/* <div className={styles.profile_header_dash_item}>
          <IoLinkOutline className={styles.profile_header_dash_item_icon} />
          <p
            onClick={() => (
              setShowConnectivity(true), setActiveDash("Connectivity")
            )}
          >
            Connectivity
          </p>
          {activeDash === "Connectivity" && (
            <IoArrowForwardOutline
              className={styles.profile_header_dash_item_icon}
            />
          )}
        </div> */}
      {/* <div className={styles.profile_header_dash_item}>
          <IoNotificationsSharp
            className={styles.profile_header_dash_item_icon}
          />
          <p
            onClick={() => (
              setShowNotifications(true), setActiveDash("Notifications")
            )}
          >
            Notifications
          </p>
          {activeDash === "Notifications" && (
            <IoArrowForwardOutline
              className={styles.profile_header_dash_item_icon}
            />
          )}
        </div> */}
      {/* <div className={styles.profile_header_dash_item}>
          <IoShieldCheckmarkSharp
            className={styles.profile_header_dash_item_icon}
          />
          <p
            onClick={() => (
              setShowPasswordAndSecurity(true),
              setActiveDash("Password & Security")
            )}
          >
            Password & Security
          </p>
          {activeDash === "Password & Security" && (
            <IoArrowForwardOutline
              className={styles.profile_header_dash_item_icon}
            />
          )}
        </div> */}
      {/* </div> */}

      <div className={styles.profile_body}>
        {!loading && renderCurrentMenu()}
      </div>
    </div>
  );
};

export default Profile;
