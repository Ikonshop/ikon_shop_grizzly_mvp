import React, { useState, useEffect } from "react";
import { getBuyerOrders } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Header from "../Header";
import styles from "./styles/UserOrders.module.css";
import Loading from "../Loading";
import { IoOptionsOutline, IoSearchOutline } from "react-icons/io5";
import * as web3 from "@solana/web3.js";

function UserOrders() {
  const [loading, setLoading] = useState(true);
  const [noOrders, setNoOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ascendingOrders, setAscendingOrders] = useState([]);

  const [productIdArray, setProductIdArray] = useState([]);
  const [currentWallet, setCurrentWallet] = useState([]);
  const { publicKey } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState("");


  const renderLoading = () => <Loading />;

  const renderDisplay = () => {
    // console.log("wtf is the orders", orders);
    return (
      <div className={styles.order_container}>
        {/* TODO: Fix Search and Sort */}
        {/* <div className={styles.searchBarSection}>
          <div className={styles.search_filter}>
            <div className={styles.inputSection}>
              <input type="text" name="Search" placeholder="Search products" />
              <IoSearchOutline className={styles.searchIcon} />
            </div>
            <div className={styles.sortContainer}>
              <span>Filter by</span>
              <IoOptionsOutline />
            </div>
          </div>
        </div> */}
        {/* <h4 className={styles.order_header}>Order History</h4> */}
        <table className={styles.orders_table}>
          <tbody>
            <tr>
              <th>Order ID</th>
              <th>To wallet</th>
              <th>Price</th>
              <th>Date</th>
              <th></th>
            </tr>
            {orders ? (
              // map orders in reverse order
              
              orders.map((orders, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={`https://solana.fm/address/${orders.orderID}?cluster=mainnet-qn1`}
                      target="_blank"
                    >
                      {
                        orders.orderID?.slice(0, 4) + "..." + orders.orderID?.slice(orders.orderID.length - 4)
                      }
                    </a>
                  </td>
                  <td>{orders.productid[0]?.owner.slice(0, 4) + "..." + orders.productid[0]?.owner.slice(-4)}</td>
                  <td>
                    {orders.price} {orders.token}
                  </td>
                  <td>{new Date(orders.createdAt).toDateString()}</td>

                  <td>
                    {/* <a href={`/order/${orders.id}`}>View Details</a> */}
                    Detailed View Coming Soon
                  </td>
                </tr>
              ))
            ) : (
              <p>You have not bought anything.</p>
            )}    
          </tbody>
        </table>
      </div>
      // <div className={styles.user_containter}>
      //   <div className={styles.faqs}>
      //     <h1 className={styles.link_header}>Order History</h1>
      //   </div>
      //   <div className={styles.order_container}>
      //     <div className={styles.order_blob}>
      //       {orders.length > 0 ? (
      //         orders.map((orders) => (
      //           <>
      //             <div className={styles.order}>
      //               <div className={styles.order_title_price}>
      //                 <p className={styles.product_title}>My first product</p>
      //                 {/* {orders.productid[0] ? (
      //                   <p className={styles.product_title}>
      //                     {orders.productid[0].name}
      //                   </p>
      //                 ) : null} */}
      //                 <p className={styles.order_price}>
      //                   {orders.price} {orders.token}
      //                 </p>
      //               </div>

      //               <p className={styles.order_date}>
      //                 {new Date(orders.purchaseDate).toDateString()}
      //               </p>

      //               <Link href={`/order/${orders.orderId}`}>
      //                 <p className={styles.order_details_btn}>
      //                   View Order Details
      //                 </p>
      //               </Link>

      //               <Link href={`https://solscan.io/account/${orders.orderID}`}>
      //                 <p className={styles.txn_details}>Txn Details</p>
      //               </Link>
      //             </div>
      //           </>
      //         ))
      //       ) : (
      //         <p>You have not bought anything.</p>
      //       )}
      //     </div>
      //   </div>
      // </div>
    );
  };

  useEffect(() => {
    if (publicKey) {
      const owner = publicKey.toString();
      setCurrentWallet(owner);
      const getOrders = async () => {
        const orders = await getBuyerOrders(owner);
        if (orders.length > 0) {
          setOrders(orders);

          const productIds = orders.map((order) => order.productid);
          setProductIdArray(productIds);

          setNoOrders(false);

        } else {
          setNoOrders(true);
        }
      };
      getOrders();
    }
  }, [publicKey]);

  useEffect(() => {
    const checkMagicLogin = async() => {
      if (localStorage.getItem("userMagicMetadata")) {
        const userMagicMetadata = JSON.parse(
          localStorage.getItem("userMagicMetadata")
        );
        const magicPubKey = new web3.PublicKey(userMagicMetadata.publicAddress);
        setUserPublicKey(magicPubKey.toString());
        const owner = magicPubKey.toString();
        setCurrentWallet(owner);
        const getOrders = async () => {
          const orders = await getBuyerOrders(owner);
          if (orders.length > 0) {
            setOrders(orders);

            const productIds = orders.map((order) => order.productid);
            setProductIdArray(productIds);

            setNoOrders(false);

          } else {
            setNoOrders(true);
            
          }
        };
        getOrders();
      }
    };
    if(!publicKey){
      
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
        {loading ? renderLoading() : renderDisplay()}

        {orders === 0 ? <h1>No Orders Found!</h1> : null}
      </div>
    </>
  );
}
export default UserOrders;
