import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getSingleProductBySku,
  fetchProducts,
  getSingleProductOrders,
} from "../../lib/api";
import { render } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Buy from "../../components/Buy";
import { useWallet } from "@solana/wallet-adapter-react";
// import Head from "next/head";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "./SingleOrder.module.css";
import useClipboard from "../../hooks/useClipboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown } from "react-ionicons";

export default function SingleProductViewer({}) {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    purchasedCount: "",
    token: "",
    id: "",
  });
  const [tipAmount, setTipAmount] = useState("");
  const [tipProduct, setTipProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [noOrders, setNoOrders] = useState(false);
  // grab current url of window

  // grab the last four digits of the url
  // const lastFour = url.slice(-4);
  // grab the product id from the url

  // console.log(url)

  // const { name, price, description, imageUrl, owner } = product;
  useEffect(() => {
    setLoading(true);
    // create async function called showProductDetails
    async function showProductDetails() {
      const url = window.location.href;
      const productId = url.slice(-25);
      const data = await getSingleProductBySku(productId);
      const orders = await getSingleProductOrders(productId);
      if (orders.length > 0) {
        console.log("order data", orders.length);
        setProduct(data.product);
        setOrderData(orders);
        console.log("order 1", orders[0]);
        setLoading(false);
      } else {
        setNoOrders(true);
        setLoading(false);
      }
    }
    showProductDetails();
  }, []);

  const renderNoOrders = () => (
    <div className={styles.no_orders}>
      <img src={require("/public/lotties/empty-order-state.gif")} />
      <p>You have no orders</p>
    </div>
  );

  const renderSingleProductOrders = () => (
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
          </div>
        </div>
        <div className={styles.product_details_col}>
          <div className={styles.product_details_name}>{product.name}</div>
          <div className={styles.product_details_owner}>
            Owner: <span>{product.owner}</span>
          </div>
          <div className={styles.product_details_owner}>
            Unique Buyers : <span>{orderData.length}</span>
          </div>
          <div className={styles.product_details_owner}>
            Price :{" "}
            <span>
              {product.price}
              {product.token.toUpperCase()}
            </span>
          </div>
          <div className={styles.product_details_owner}>
            Total Sales :{" "}
            <span>
              {product.purchasedCount * product.price}
              {product.token.toUpperCase()}
            </span>
          </div>

          <br />
          <br />

          {orderData.map((order, index) => (
            <div className={styles.single_product_order} key={index}>
              <div className={styles.single_product_order_placeholder}>
                <div id={styles.shownBuyer}>
                  <p>
                    {order.buyer.slice(0, 4)}...{order.buyer.slice(-5)}
                  </p>
                  <ChevronDown
                    style={{
                      marginLeft: "20px",
                      marginTop: "-20px",
                      color: "#727272",
                    }}
                  />
                </div>
                <p id={styles.hiddenBuyer}>
                  {order.buyer.slice(0, 4)}...{order.buyer.slice(-5)}{" "}
                  <span className={styles.copy_icon}>
                    <span onClick={() => useClipboard(order.buyer)}>Copy</span>
                    {/* <FontAwesomeIcon
                      icon={faCopy}
                      onClick={() => useClipboard(order.buyer)}
                    /> */}
                  </span>
                  <br />
                  {new Date(order.purchaseDate).toLocaleDateString()}
                  <br />
                  {order.price}
                  {order.token}
                  <br />
                  {order.orderID}
                  <br />
                  {order.email}
                  <br />
                  {order.shipping}
                  <br />
                  {order.note}
                </p>
              </div>

              {product.reqUserEmail || product.reqUserShipping ? (
                <>
                  <div className={styles.single_product_order_info_right}>
                    {product.reqUserEmail ? (
                      <div id={styles.email}>
                        <div id={styles.shownEmail}>
                          <p>Email ✅</p>
                          <ChevronDown
                            style={{
                              marginLeft: "20px",
                              marginTop: "-20px",
                              color: "#727272",
                            }}
                          />
                        </div>
                        <div id={styles.hiddenEmail}>
                          {order.email}{" "}
                          <FontAwesomeIcon
                            className={styles.copy_icon}
                            icon={faCopy}
                            onClick={() => useClipboard(order.email)}
                          />
                        </div>
                      </div>
                    ) : (
                      <p>Email ☐</p>
                    )}
                  </div>
                  <div className={styles.single_product_order_info_right}>
                    {product.reqUserShipping ? (
                      <div id={styles.shipping}>
                        <div id={styles.shownText}>
                          {" "}
                          <p>Shipping ✅</p>
                          <ChevronDown
                            style={{
                              marginLeft: "20px",
                              marginTop: "-20px",
                              color: "#727272",
                            }}
                          />
                        </div>
                        <div id={styles.hiddenText}>
                          {order.shipping}{" "}
                          <FontAwesomeIcon
                            className={styles.copy_icon}
                            icon={faCopy}
                            onClick={() => useClipboard(order.shipping)}
                          />
                        </div>
                      </div>
                    ) : (
                      <p>Shipping ☐</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLoading = () => <Loading />;

  return (
    <>
      {loading && !noOrders ? renderLoading() : renderSingleProductOrders()}
      {!loading && noOrders ? renderNoOrders() : null}
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
