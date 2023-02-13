import React, { useState, useEffect } from "react";
import { GetCollectionSubs, fetchProductsByCollectionId } from "../../lib/api";
import styles from "../../styles/Product.module.css";
import Product from "../../components/Product/Product";
import SubscriptionCard from "../../components/SubscriptionCard";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import {
  LogoTwitter,
  LogoDiscord,
  LogoYoutube,
  LogoMedium,
  LogoWebComponent,
  LogoInstagram,
  TicketOutline,
} from "react-ionicons";
import { useRouter } from "next/router";

function Store() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [discordServer, setDiscordServer] = useState("");
  const [website, setWebsite] = useState("");
  const [youtube, setYoutube] = useState("");
  const [allSubs, setAllSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function showProductDetails() {
      const url = window.location.href;
      const collectionId = url.split("/")[4].split("?")[0];
      const collection = await fetchProductsByCollectionId(collectionId);
      setProducts(collection.products);
     
      setBanner(collection.banner);
      setProjectName(collection.projectName);
      setProjectDesc(collection.description);
      setTwitterHandle(collection.twitterHandle);
      setInstagramHandle(collection.instagramHandle);
      setDiscordServer(collection.discordServer);
      setWebsite(collection.website);
      setYoutube(collection.youtube);
      setLoading(false);
    }
    showProductDetails();
  }, []);


  return (
    <>
      <div className="store_hero">
        <div className="containers">
          <div className="row1">
            <div className="p_title">
              <span>Project name:</span>
              <h4>{projectName}</h4>
            </div>

            <div className="p_desc">
              <span>Description:</span>
              <p>{projectDesc}</p>
            </div>
            <div className="hero_socials">
              <a href={twitterHandle} target="_blank" rel="noreferrer">
                <LogoTwitter
                  style={{
                    color: "#fff",
                    background: "#dadada",
                    width: "50px",
                    height: "50px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a href={instagramHandle} target="_blank" rel="noreferrer">
                <LogoInstagram
                  style={{
                    color: "#fff",
                    background: "#dadada",
                    width: "50px",
                    height: "50px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a href={youtube} target="_blank" rel="noreferrer">
                <LogoYoutube
                  style={{
                    color: "#fff",
                    background: "#dadada",
                    width: "50px",
                    height: "50px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a href={discordServer} target="_blank" rel="noreferrer">
                <LogoDiscord
                  style={{
                    color: "#fff",
                    background: "#dadada",
                    width: "50px",
                    height: "50px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
              <a href={website} target="_blank" rel="noreferrer">
                <LogoWebComponent
                  style={{
                    color: "#fff",
                    background: "#dadada",
                    width: "50px",
                    height: "50px",
                    borderRadius: "24px",
                    fontSize: "16px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                />
              </a>
            </div>
          </div>
          {banner !== "" && (        
            <div className="row2">
              <img src={banner} alt="banner" />
              <div className="overlay"></div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="banner_hero">
            <div className="hero_text">
              <h1>Welcome to Ikon's Store.</h1>
              <button className="hero-button">Shop Now</button>
            </div>
            <div className="hero_overlay"></div>
            <img className="banner-container" src={banner} alt="banner" />
          </div> */}
      <Container>
        <div className="search_container">
          <div className="input_wrap">
            <input
              type="text"
              name="product_search"
              placeholder="Search products"
            />
          </div>
        </div>
        <div className="products-container">
          {products.map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </div>
        {!loading && allSubs.length > 0 && (
          <div className="sub_div">
            <h6 className="subscriptions_header">SUBSCRIPTIONS</h6>
            <TicketOutline style={{ marginTop: "-10px", marginLeft: "16px" }} />
          </div>
        )}
        <div className="products-container">
          {!loading &&
            allSubs.length > 0 &&
            allSubs.map((sub, index) => (
              <SubscriptionCard key={index} sub={sub} />
            ))}
        </div>
      </Container>
    </>
  );
}
export default Store;
