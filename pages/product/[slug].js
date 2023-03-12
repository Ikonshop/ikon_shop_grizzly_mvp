import React, { useState, useEffect } from "react";
import { getSingleProductBySku, fetchProducts } from "../../lib/api";
import styles from "../../styles/ProductDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Buy from "../../components/Buy";
import Send from "../../components/MagicWallet/send";
import { useWallet } from "@solana/wallet-adapter-react";
// import Head from "next/head";
import Loading from "../../components/Loading";
import PaylinkComponent from "../../components/Paylink";
import { useRouter } from "next/router";
import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";
import * as web3 from "@solana/web3.js";


export default function SingleProductViewer({}) {
  const { publicKey, connected } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);
  const [magicUser, setMagicUser] = useState(false);
  const router = useRouter();
  const [product, setProduct] = useState({
    type: "",
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    id: "",
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const rpcUrl = "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7";
  const connection = new web3.Connection(rpcUrl);

  // create a small image carousel for the product.productImages array
  const handleImageChange = (e) => {
    const { name } = e.target;
    if (name === "next") {
      if (currentImage === product.productImages.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    } else {
      if (currentImage === 0) {
        setCurrentImage(product.productImages.length - 1);
      } else {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  const renderProductImages = () => {
    return productImages.map((image, index) => {
      return (
        <div
          key={index}
          className={styles.productImage}
          style={{
            display: index === currentImage ? "flex" : "none",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={image}
            alt="product"
            style={{
              display: "flex",
              height: "200px",
              width: "auto",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </div>
      );
    });
  };

  const renderSingleProduct = () => (
    <div className={styles.product_details_container}>
      <div className={styles.product_details_row}>
        <div className={styles.product_details_col}>
          <div className={styles.back_wrapper}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <button
              className={styles.prod_back_to_shop}
              onClick={() => router.back()}
            >
              <a>
                <p className={styles.prod_back_to_shop}>Back</p>
              </a>
            </button>
          </div>
          <div className={styles.product_details_img}>
            <div className={styles.prod_img}>
              <img src={product.imageUrl} alt={product.name} />
            </div>
            {productImages.length > 0 && (
              <div className={styles.prod_img_carousel}>
                <FontAwesomeIcon
                  onClick={handleImageChange}
                  name="prev"
                  icon={faArrowLeft}
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    padding: "0.5rem",
                    border: "none",
                    //make the background transparent
                  }}
                />
                {renderProductImages()}
                <FontAwesomeIcon
                  onClick={handleImageChange}
                  name="next"
                  icon={faArrowRight}
                  style={{
                    color: "white",
                    fontSize: "1.5rem",
                    backgroundColor: "black",
                    borderRadius: "50%",
                    padding: "0.5rem",
                    border: "none",
                    //make the background transparent
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.product_details_col}>
          <div className={styles.product_details_owner}>
            Owner: {product.owner}
          </div>
          <div className={styles.product_details_name}>{product.name}</div>
          {product.type != "tipjar" && (
            <div className={styles.product_details_price}>
              {product.price} {product.token}
            </div>
          )}
          {/* if product.type is tipjar then display text box for user to enter a price and display button setTipAmount to that price*/}

          <div className={styles.product_details_desc_head}>Description</div>
          <div className={styles.product_details_desc}>
            {product.description}
          </div>
          {publicKey && !loading && (
            <Buy
              id={product.id}
              price={product.price}
              token={product.token}
              owner={product.owner}
              product={product}
              collection={product.collections ? product.collections[0].symbol : null}
            />
          )}
          {userPublicKey && magicUser && !loading && (
            <Send
              buyer={userPublicKey}
              recipient={product.owner}
              price={product.price}
              token={product.token}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderSingleLink = () => (
    <div className={styles.product_details_container}>
      <PaylinkComponent product={product} />
    </div>
  );


  useEffect(() => {
    // create async function called showProductDetails
    async function showProductDetails() {
      const url = window.location.href;
      //url : http://localhost:3000/product/cldy0nu7rtpju0ak2v50nhm88?email=maweiche%40gmail.com
      //productId : cldy0nu7rtpju0ak2v50nhm88
      const productId = url.split("/")[4].split("?")[0];
      const data = await getSingleProductBySku(productId);
      console.log(data.product)
      setProduct(data.product);
      // data.product.productImages returns an array of objects with a url property, so we need to map over it to get the url
      setProductImages(data.product.productImages.map((image) => image.url));
      setLoading(false);
    }
    showProductDetails();
  }, []);

  useEffect(() => {
    if (publicKey) {
      setUserPublicKey(publicKey);
      setLoading(false);
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
           setMagicUser(true)
          magic.user.getMetadata().then((user) => {
            const pubKey = new web3.PublicKey(user.publicAddress);
            setUserPublicKey(pubKey);
            setUserEmail(user.email);
          });
        }
        setLoading(false);
    }
    checkUser();
    
}, []);

  return (
    <>
      {loading ? <Loading /> : null}
      {!loading && product.type === "product" ? renderSingleProduct() : null}
      {(!loading && product && product.type === "link") || product.type === "tipjar"
        ? renderSingleLink()
        : null}
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
