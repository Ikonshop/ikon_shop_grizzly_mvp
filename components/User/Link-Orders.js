import React, { useState, useEffect } from "react";
import { GetLinkOrdersForOwner, GetTipOrdersForOwner } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "./styles/UserOrders.module.css";
import Loading from "../../components/Loading";
import { ArrowForward, SearchOutline, OptionsOutline } from "react-ionicons";
import { IoSearchOutline } from "react-icons/io5";
import * as web3 from "@solana/web3.js";
// import Lottie from 'react-lottie';
// import animationData from './lotties/empty-order-state';

function Orders() {
  const [loading, setLoading] = useState(true);
  const [noOrders, setNoOrders] = useState(true);
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [productIdArray, setProductIdArray] = useState([]);

  const [sortedOrders, setSortedOrders] = useState([]);

  const { publicKey } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState("");
  const [currentWallet, setCurrentWallet] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [owner, setOwner] = useState("");

  const renderLoading = () => <Loading />;
  
  const checkMagicLogin = async () => {
    if (localStorage.getItem("userMagicMetadata")) {
      const userMagicMetadata = JSON.parse(
        localStorage.getItem("userMagicMetadata")
      );
      const magicPubKey = new web3.PublicKey(
        userMagicMetadata.publicAddress
      );
      setUserPublicKey(magicPubKey.toString());
      const owner = magicPubKey.toString();
      setCurrentWallet(owner);
      setUserEmail(userMagicMetadata.email);
      setOwner(magicPubKey.toString());
      async function sortedOrders() {
        const payReqOrders = await GetLinkOrdersForOwner(owner);
        // console.log("pay req", payReqOrders);
        for (let i = 0; i < payReqOrders.orders.length; i++) {
          ownerOrders.push(payReqOrders.orders[i]);
        }
        const tipOrders = await GetTipOrdersForOwner(owner);
        // console.log("link orders", tipOrders);
        for (let i = 0; i < tipOrders.orders.length; i++) {
          ownerOrders.push(tipOrders.orders[i]);
          if (i === tipOrders.orders.length - 1) {
            setLoading(false);
          }
        }
        if (ownerOrders.length > 0) {
          setNoOrders(false);
        }
        // sort ownersOrders by date
        const sortedOrders = ownerOrders.sort((a, b) => {
          return b.purchaseDate - a.purchaseDate;
        });
        setSortedOrders(sortedOrders);
      }
      sortedOrders();
    }
  };

  const renderDisplay = () => (
    <div className={styles.order_container}>
      {/* TODO: FIX SEARCH AND SORT */}
      {/* <div className={styles.searchBarSection}>
        <div className={styles.inputSection}>
          <input type="text" name="Location" placeholder="Search orders" />
          <IoSearchOutline className={styles.searchIcon} />
        </div>
        <div className={styles.sortContainer}>
          <p>Sort by</p>
          <OptionsOutline />
        </div>
      </div> */}

      {/* <h4 className={styles.order_header}>Order History</h4> */}
      <table className={styles.orders_table}>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Buyer</th>
            <th>Amount</th>
            <th>Item</th>
            <th>Txn</th>
          </tr>
          {ownerOrders.length > 0
            ? //map in reverse order
              sortedOrders.map((order, index) => (
                <tr key={index}>
                  <td data-th="Date">
                    {/* new Date in mm/dd/yyyy format */}
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </td>
                  <td data-th="Buyer">
                    {/* new Date in mm/dd/yyyy format */}
                    <a href={`https://solana.fm/account/${order.buyer}`}>
                      {order.buyer.slice(0, 4)}..{order.buyer.slice(-5)}
                    </a>
                  </td>
                  {order.price && order.token ? (
                    <td data-th="Amount">
                      {order.price} {order.token.toUpperCase()}
                    </td>
                  ) : null}

                  <td data-th="Item">
                    {order.productid.map((item, index) => (
                      <p key={index}>
                        {/* first 7 letters then ... */}
                        <a href={`/product/${item.id}`}>
                          {item.name.slice(0, 7)}..
                        </a>
                      </p>
                    ))}
                  </td>
                  <td data-th="Txn">
                    <a
                      href={
                        new Date(order.createdAt) >
                        new Date("2023-02-22T00:00:00.000Z")
                          ? `https://solana.fm/tx/${order.orderID}`
                          : `https://solana.fm/address/${order.orderID}`
                      }
                    >
                      Solana FM
                    </a>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      {/* <div className={styles.order_list}>
        {ownerProducts.map((product, index) => (

          <div key={index} className={styles.order_card}>
            <div className={styles.order_img}>
              <img src={product.imageUrl} />
            </div>
            <div className={styles.order_details}>
              <div className={styles.order_text}>{product.name}</div>
              <a className={styles.view_details} href={`https://ikonshop.io/order/${product.id}`} target="_blank">View</a>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );

  const renderNoOrders = () => (
    <div className={styles.no_orders}>
      <img src="/nolinks.png" />
      <p>You have no orders</p>
    </div>
  );

  useEffect(() => {
    if (publicKey) {
      setOwner(publicKey.toString());
      async function sortedOrders() {
        const payReqOrders = await GetLinkOrdersForOwner(owner);
        // console.log("pay req", payReqOrders);
        for (let i = 0; i < payReqOrders.orders.length; i++) {
          ownerOrders.push(payReqOrders.orders[i]);
        }
        const tipOrders = await GetTipOrdersForOwner(owner);
        // console.log("link orders", tipOrders);
        for (let i = 0; i < tipOrders.orders.length; i++) {
          ownerOrders.push(tipOrders.orders[i]);
          if (i === tipOrders.orders.length - 1) {
            setLoading(false);
          }
        }
        if (ownerOrders.length > 0) {
          setNoOrders(false);
        }
        // sort ownersOrders by date
        const sortedOrders = ownerOrders.sort((a, b) => {
          return b.purchaseDate - a.purchaseDate;
        });
        setSortedOrders(sortedOrders);
      }
      sortedOrders();
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      
      checkMagicLogin();
      setLoading(false);
    }

    window.addEventListener("magic-logged-in", () => {
      checkMagicLogin();
    });
    window.addEventListener("magic-logged-out", () => {
      setUserPublicKey(null);
      localStorage.removeItem("userMagicMetadata");
    });
  }, []);

  return (
    <>
      <div className={styles.main_container}>
        {loading ? renderLoading() : null}
        {!loading && !noOrders ? renderDisplay() : null}
        {!loading && noOrders ? renderNoOrders() : null}
      </div>
    </>
  );
}
export default Orders;
