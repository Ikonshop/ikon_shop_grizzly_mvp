import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./styles/Profile.module.css";
import { GetWalletSettings } from "../../lib/api";
import {
  IoArrowForwardOutline,
  IoLinkOutline,
  IoPencilSharp,
  IoNotificationsSharp,
  IoShieldCheckmarkSharp,
  IoPencil,
  IoCamera,
} from "react-icons/io5";

const Profile = (userPubKey) => {
  // DASH STATES
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showConnectivity, setShowConnectivity] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPasswordAndSecurity, setShowPasswordAndSecurity] = useState(false);

  const [activeDash, setActiveDash] = useState("Edit Profile");

  // PROFILE DATA
  const [userName, setUserName] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [email, setEmail] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [description, setDescription] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [cryptoLinks, setCryptoLinks] = useState(null);

  const [loading, setLoading] = useState(true);

  const renderEditProfile = () => {
    return (
      <div className={styles.edit_profile_container}>
        <div className={styles.profile_header}>
          <h1>Edit Profile</h1>
        </div>
        <div className={styles.profile_body}>
          {/* <div className={styles.profile_body_left}>
            <div className={styles.profile_body_left_top}>
              <div className={styles.profile_body_left_top_left}>
                <img
                  src={profilePicture != null ? profilePicture : null}
                  alt="profile"
                />
              </div>
              <div className={styles.profile_body_left_top_right}>
                <h1>Welcome, {userName}</h1>
                <p>
                  <span>Registered Wallet:</span> {walletAddress.slice(0, 4)}...
                  {walletAddress.slice(-4)}
                </p>
                <p>
                  <span>Email:</span> {email}
                </p>
              </div>
            </div>
            <div className={styles.profile_body_left_bottom}>
              <h1>Description</h1>
              {/* description will be displayed as markdown 
              <p>{description}</p>

              <h1>Social Links</h1>
              <ul className={styles.link_list}>
                {socialLinks != null
                  ? socialLinks.map((link, index) => {
                      return (
                        <li key={index}>
                          <a href={link} target="_blank" rel="noreferrer">
                            {link}
                          </a>
                        </li>
                      );
                    })
                  : null}
              </ul>

              <h1>Crypto Links</h1>
              <ul className={styles.link_list}>
                {cryptoLinks != null
                  ? cryptoLinks.map((link, index) => {
                      return (
                        <li key={index}>
                          <a href={link} target="_blank" rel="noreferrer">
                            {link}
                          </a>
                        </li>
                      );
                    })
                  : null}
              </ul>
            </div>
          </div> */}
          <div className={styles.profile_body_right}>
            {/* <div className={styles.profile_body_right_top}>
              <h1>Update Profile</h1>
            </div> */}
            <div className={styles.profile_image_container}>
              <div className={styles.profile_image}>
                <div
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
                </div>
                <img src="/user_phantom.png" />
              </div>
            </div>
            <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_right_bottom_left}>
                <p>Name</p>
                <input
                  type="text"
                  className={styles.profile_body_right_input}
                  placeholder={userName ? userName : "Name"}
                />
              </div>
              <div className={styles.profile_body_right_bottom_right}>
                <p>Email</p>
                <input
                  type="text"
                  className={styles.profile_body_right_input}
                  placeholder={email ? email : "Email"}
                />
              </div>
            </div>
            <br />
            <div className={styles.profile_description}>
              <p>Description</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder={description ? description : "Description"}
              />
            </div>
            <div className={styles.profile_link_list}>
              <p>Social Links</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder="Social links, separated by a comma"
              />
            </div>
            <div className={styles.profile_link_list}>
              <p>Crypto Links</p>
              <textarea
                className={styles.profile_body_right_textarea}
                placeholder="Crypto links, separated by a comma"
              />
            </div>
            <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_image_input}>
                <p>Profile Picture</p>
                <input type="file" />
              </div>
            </div>
            <div className={styles.profile_body_right_bottom}>
              <div className={styles.profile_body_update}>
                <button>Update</button>
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
      setLoading(true);
      const response = await GetWalletSettings(userPubKey);
      console.log("get wallet settings resp", response);
      setEmail(response.email != null ? response.email : "");
      setUserName(response.name != null ? response.name : "");
      setProfilePicture(
        response.profileImage != null ? response.profileImage.url : ""
      );
      setDescription(response.description != null ? response.description : "");
      setSocialLinks(response.socialLinks != null ? response.socialLinks : []);
      setCryptoLinks(response.cryptoLinks != null ? response.cryptoLinks : []);
      setLoading(false);
    };
    getWalletSettings();
  }, []);

  return (
    <div className={styles.profile_container}>
      {/* container with profile dash on left and current menu on right */}
      {/* dash will contain the following options: Edit Profile, Connectivity, Notifications, Password & Security */}
      {/* when selected, that option becomes the current menu on right */}
      {/* active Dash will have <IoArrowForwardOutline /> next to it */}

      <div className={styles.profile_header_dash}>
        <div className={styles.profile_header_dash_item}>
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
        </div>
        <div className={styles.profile_header_dash_item}>
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
        </div>
        <div className={styles.profile_header_dash_item}>
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
        </div>
        <div className={styles.profile_header_dash_item}>
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
        </div>
      </div>

      <div className={styles.profile_body}>
        {!loading && renderCurrentMenu()}
      </div>
    </div>
  );
};

export default Profile;
