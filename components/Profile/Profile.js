import React, {useState, useEffect} from "react";
import styles from "./styles/Profile.module.css";


const Profile = (data) => {
    const profile = data.data;
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [owner, setOwner] = useState(null);
    const [cryptoLinks, setCryptoLinks] = useState(null);
    const [socialLinks, setSocialLinks] = useState(null);
    const [description, setDescription] = useState(null);
    const [highscores, setHighscores] = useState(null);
    const [profileImage, setProfileImage] = useState(null);


    useEffect(() => {
        if(!profile) return;
        console.log('profile', profile)
        var linksSocial = [];
        var linksCrypto = [];
        const verified = profile.verified;
        const createdAt = profile.createdAt;
        const owner = profile.owner;
        const cryptoLinks = profile.cryptoLinks;
        const socialLinks = profile.socialLinks;
        const description = profile.description;
        const highscores = profile.highscores;
        const profileImage = profile.profileImage.url;

        for (var i = 0; i < socialLinks.length; i++) {
            linksSocial.push(socialLinks[i]);
        }
        for (var i = 0; i < cryptoLinks.length; i++) {
            linksCrypto.push(cryptoLinks[i]);
        }
        console.log('linksCrypto', linksCrypto)
        setVerified(verified);
        setCreatedAt(createdAt);
        setOwner(owner);
        setCryptoLinks(linksCrypto);
        setSocialLinks(linksSocial);
        setDescription(description);
        setHighscores(highscores);
        setProfileImage(profileImage);
        setLoading(false);
    }, []);
    return (
        <div>
            {loading ? <p>Loading...</p> : (
            <div id="content" className={styles.content}>
                <div id="left" className={styles.left}>
                <div id="profile" className={styles.profile}>
                    <div className={styles.profile_container}>
                        <img
                            src={profileImage}
                            alt="Profile picture"
                        >
                        
                        </img>
                        {!verified && <div className={styles.profile_overlay}></div>}
                    </div>
                    <h1>John Doe</h1>
                    <h2>Wallet: {owner.slice(0,4)}...{owner.slice(-4)}</h2>
                    <p>{verified ? 'Verified' : 'Not Verified'}</p>
                    <p>Ikon Since : {new Date(createdAt).toLocaleDateString()}</p>
                    {/* <p>Location: New York, NY</p>
                    <p>Status: Single</p> */}
                </div>
                <div id="about" className={styles.about}>
                    <h2>About Me:</h2>
                    <p>{description}</p>
                </div>
                <div id="interests" className={styles.interests}>
                    <h2>Crypto Interests:</h2>
                    {cryptoLinks.map((link, index) => {
                        <a
                            key={index}
                            href={link}
                        >
                            {link}
                        </a>
                    })
                    }
                </div>
                </div>
                <div id="right" className={styles.right}>
                <div id="friends" className={styles.friends}>
                    <h2>Social Links:</h2>
                    <ul>
                        {socialLinks.map((link, index) => {
                            <li
                                key={index}
                                onClick={() => window.open(link.url, "_blank")}
                            >
                                {link}
                            </li>
                        })}
                    </ul>
                </div>
                <div id="friends" className={styles.friends}>
                    <h2>High Scores:</h2>
                    <ul>
                        {highscores.map((score, index) => {
                            <li
                                key={index}
                            >
                                {score}
                            </li>
                        })}
                    </ul>
                </div>
                {/* <div id="comments" className={styles.comments}>
                    <h2>Comments:</h2>
                    <ul>
                    <li>
                        <img src="https://i.imgur.com/PKHrRZd.jpg" alt="Profile picture" />
                        <p><a href="#">Jane Doe</a> Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </li>
                    <li>
                        <img src="https://i.imgur.com/PKHrRZd.jpg" alt="Profile picture" />
                        <p><a href="#">Bob Smith</a> Sed consequat, sapien nec consequat lobortis, purus ligula vestibulum dolor, a finibus eros purus id est.</p>
                    </li>
                    </ul>
                </div> */}
                </div>
            </div>
            )}
        </div>
    )
}

export default Profile