import React, { useState, useEffect } from "react";
import { GetMerchantOverview } from "../../lib/api";
import ChartRender from "../Chart.js";
import styles from "./styles/Overview.module.css";
import {
  faPlay,
  faPlayCircle,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoCashOutline } from "react-icons/io5";
import * as web3 from "@solana/web3.js";
import Loading from "../Loading";
import { CreateCollectionFromMagic, CheckForCollectionByOwner  } from "../../lib/api";


const Overview = (req) => {
  const publicKey = req.publicKey;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [userPublicKey, setUserPublicKey] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentWallet, setCurrentWallet] = useState("");

  const [totalSalesForYear, setTotalSalesForYear] = useState(0);

  const solana_logo = "/solana_logo.svg";
  const usdc_logo = "/usdc.png";

  const renderBestSellingTable = () => {
    return (
      <table className={styles.best_table}>
        <tr styles={{ backgroundColor: "red" }}>
          <th>Product</th>
          <th></th>
          <th>Price</th>
          <th>Sold</th>
          <th>Status</th>
        </tr>
        {products.map((product, index) => {
          return (
            <tr key={index}>
              <td
                style={{
                  width: "50px",
                }}
              >
                <img
                  className={styles.best_selling_product_img}
                  src={product.imageUrl}
                  alt="product image"
                />
              </td>
              <td
                style={{
                  width: "250px",
                }}
              >
                <p className={styles.product_name}>{product.name}</p>
              </td>
              <td
                style={{
                  width: "100px",
                }}
              >
                {product.price}{" "}
                {product.token === "sol" ? (
                  <img
                    src={solana_logo}
                    alt="solana logo"
                    width={20}
                    height={20}
                  />
                ) : (
                  <img src={usdc_logo} alt="usdc logo" width={20} height={20} />
                )}
              </td>
              <td
                style={{
                  width: "150px",
                }}
              >
                {product.purchasedCount}
              </td>
              <td>
                {/* if product quantity is > 0 then display a green dot with 'In Stock' next to it, else display a red dot with 'Out of Stock' next to it */}
                {product.quantity > 0 ? (
                  <p className={styles.in_stock_text}>
                    <span>
                      <FontAwesomeIcon
                        icon={faDotCircle}
                        className={styles.in_stock_dot}
                      />
                    </span>
                    In Stock
                  </p>
                ) : (
                  <p lassName={styles.out_of_stock_text}>
                    <FontAwesomeIcon
                      icon={faDotCircle}
                      className={styles.out_of_stock_dot}
                    />
                    Out of Stock
                  </p>
                )}
              </td>
            </tr>
          );
        })}
      </table>
    );
  };

  const renderRecentSalesTable = () => {
    return (
      <table>
        {/* <thead>
          <tr>
            <th></th>
            <th>Order</th>
            <th>Price</th>
          </tr>
        </thead> */}
        <tbody>
          {recentSales.map((order, index) => {
            return (
              <tr className={styles.recent_sales_tr} key={index}>
                <td>
                  <img
                    src={order.productid[0].imageUrl}
                    alt="product image"
                    width={40}
                    height={40}
                    style={{
                      borderRadius: "20px",
                      marginTop: "-10px",
                    }}
                  />
                </td>
                <td>
                  <a
                    className={styles.order_id}
                    href={`https://solscan.io/tx/${order.orderID}`}
                    target="_blank"
                  >
                    <p
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {order.orderID.slice(0, 3)}..{order.orderID.slice(-3)}
                    </p>
                  </a>
                </td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <p>{order.productid[0].price} </p>
                  {order.productid[0].token === "sol" ? (
                    <img
                      src={solana_logo}
                      alt="solana logo"
                      width={20}
                      height={20}
                      style={{
                        marginTop: "-15px",
                      }}
                    />
                  ) : (
                    <img
                      src={usdc_logo}
                      alt="usdc logo"
                      width={20}
                      height={20}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderSalesChart = () => {
    //organize the orders by month and their total sales calculated by totaling all of the order.productid.price for that month
    const januarySales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "01"
    );
    const februarySales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "02"
    );
    const marchSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "03"
    );
    const aprilSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "04"
    );
    const maySales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "05"
    );
    const juneSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "06"
    );
    const julySales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "07"
    );
    const augustSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "08"
    );
    const septemberSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "09"
    );
    const octoberSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "10"
    );
    const novemberSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "11"
    );
    const decemberSales = orders.filter(
      (order) => order.purchaseDate.slice(5, 7) === "12"
    );

    const calculateTotalSales = (month) => {
      return month.reduce((acc, order) => {
        return (
          acc +
          order.productid.reduce((acc, product) => {
            return acc + parseInt(product.price);
          }, 0)
        );
      }, 0);
    };

    const salesByMonth = [
      calculateTotalSales(januarySales),
      calculateTotalSales(februarySales),
      calculateTotalSales(marchSales),
      calculateTotalSales(aprilSales),
      calculateTotalSales(maySales),
      calculateTotalSales(juneSales),
      calculateTotalSales(julySales),
      calculateTotalSales(augustSales),
      calculateTotalSales(septemberSales),
      calculateTotalSales(octoberSales),
      calculateTotalSales(novemberSales),
      calculateTotalSales(decemberSales),
    ];

    return (
      <>
        <ChartRender table_data={salesByMonth} />
      </>
    );
  };

  useEffect(() => {
    if(publicKey){
      (async () => {
        if (document.getElementById("salesChart")) {
          document.getElementById("salesChart").remove();
        }
        const salesChartContainer = document.getElementById(
          "salesChartContainer"
        );
        const salesChartElement = document.createElement("canvas");

        salesChartElement.id = "salesChart";
        const owner = publicKey.toString();
        const response = await GetMerchantOverview(owner);
        //sort the response into orders and products
        setOrders(response.orders);
        setProducts(response.products);
        //setRecentSales to the last 3 orders
        setRecentSales(response.orders.slice(0, 3));
        setLoading(false);
      })();
    }
    if(!publicKey && userPublicKey.toString()){
      (async () => {
        if (document.getElementById("salesChart")) {
          document.getElementById("salesChart").remove();
        }
        const salesChartContainer = document.getElementById(
          "salesChartContainer"
        );
        const salesChartElement = document.createElement("canvas");

        salesChartElement.id = "salesChart";
        const owner = userPublicKey.toString()
        const response = await GetMerchantOverview(owner);
        //sort the response into orders and products
        setOrders(response.orders);
        setProducts(response.products);
        //setRecentSales to the last 3 orders
        setRecentSales(response.orders.slice(0, 3));
        setLoading(false);
      })();
    }
  }, []);

  const checkMagicLogin = async() => {
    if (localStorage.getItem("userMagicMetadata")) {
      const userMagicMetadata = JSON.parse(
        localStorage.getItem("userMagicMetadata")
      );
      setUserEmail(userMagicMetadata.email);
      const magicPubKey = new web3.PublicKey(userMagicMetadata.publicAddress);
      setCurrentWallet(magicPubKey.toString());
      setUserPublicKey(magicPubKey.toString());
      
      const data = await CheckForCollectionByOwner(magicPubKey.toString());
      console.log('data', data);
      
      console.log("userMagicMetadata", userMagicMetadata);
    }
  };

  useEffect(() => {
    if(!publicKey) {
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

  return (
    <>
      {loading && (
        <div>
          <Loading />
        </div>
      )}

      {!loading && userPublicKey && (
        <div className={styles.overview_container}>
          {/* Sales Container  */}
          <div className={styles.sales_container}>
            <div className={styles.left_container}>
              <div className={styles.banner_container}>
                <div className={styles.banner_left_container}>
                  <h4>Explore your dashboard</h4>
                  <p>Keep track of your orders, community, and much more</p>
                  <button
                    className={styles.learn_more_button}
                    onClick={() => {
                      // play video here
                    }}
                  >
                    Learn how it works{""}{" "}
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "10px",
                      }}
                      icon={faPlayCircle}
                    />
                  </button>
                </div>

                <img
                  src="/pc.png"
                  alt="banner"
                  className={styles.banner_image}
                />
              </div>
              <div className={styles.best_selling_container}>
                <p className={styles.best_selling_header_text}>
                  Best selling products
                </p>
                {renderBestSellingTable()}
              </div>
            </div>
            <div className={styles.right_container}>
              <div className={styles.overall_sales_container}>
                <p className={styles.header_text}>Overall Sales</p>
                {/* <p className={styles.sub_header_text}>${totalSalesForYear}</p> */}
                {renderSalesChart()}
              </div>
              <div className={styles.recent_sales_container}>
                <div className={styles.recent_sales_header}>
                  <p className={styles.header_text}>Recent Sales</p>
                  <p
                    className={styles.view_all_button}
                    onClick={() => {
                      //dispatch event to view_all_orders
                      const event = new CustomEvent("view_all_orders");
                      window.dispatchEvent(event);
                      console.log("view all orders");
                    }}
                  >
                    See All
                  </p>
                </div>
                {renderRecentSalesTable()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Overview;
