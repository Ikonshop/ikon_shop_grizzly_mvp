import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInstagram } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";
import { IoLogoDiscord, IoLogoTwitter } from "react-icons/io5";

// import Head from "next/head";

export default function HeaderComponent() {
  const router = useRouter();
  const TWITTER_HANDLE = "ikonsOfSol";
  const TWITTER_LINK = "https://twitter.com/";
  const IG_LINK = "https://instagram.com/";
  return (
    <div className="footer_container">
      {/* <span className="twitter-logo"><a href={`${TWITTER_LINK}${TWITTER_HANDLE}`} target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a></span>
        <span className="twitter-logo"><a href="/faq/how-to">FAQ</a></span>
        <span className="twitter-logo"><a href={`${IG_LINK}${TWITTER_HANDLE}`}></a></span> */}
      <Container>
        <div className="footer_row">
          <div>
            <img
              src="/newlogo.png"
              style={{ cursor: "pointer", maxWidth: "100px" }}
            />
          </div>

          <div className="footer_links">
            {/* <p>Support</p>
            <p>About</p>
            <p>Company</p>
            <p>Movement</p> */}
            <a href="https://twitter.com/IkonShopApp">
              <IoLogoTwitter />
            </a>
            <a href="https://discord.gg/ikons">
              <IoLogoDiscord />
            </a>
          </div>
        </div>
        <div className="footer_row2">
          <div>
            <p className="footer_copyright">
              2022 IkonShop , All Rights Reserved
            </p>
          </div>

          <div className="footer_links2">
            <a href="/terms">
              <p>Terms and Conditions</p>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
