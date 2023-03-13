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
              <th>Order</th>
              <th>Item</th>
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
                      href={
                        new Date(orders.createdAt)> new Date('2023-02-22T00:00:00.000Z')
                          ? `https://solana.fm/tx/${orders.orderID}`
                          : `https://solana.fm/address/${orders.orderID}`
                      }
                      target="_blank"
                    >
                      {
                        orders.orderID?.slice(0, 4) + "..." + orders.orderID?.slice(orders.orderID.length - 4)
                      }
                    </a>
                  </td>
                  <td>{orders.productid[0].name}</td>
                  <td>
                    {orders.price} {orders.token}
                  </td>
                  {/* make date string like 1/2/2023 */}
                  <td>{new Date(orders.createdAt).toLocaleDateString()}</td>

                  <td>
                    <a href={`/product/${orders.productid[0].id}`} target='blank'>View</a>
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

      //               <Link href={`https://solana.fm/account/${orders.orderID}`}>
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
        console.log('orders', orders)
        if (orders.length > 0) {
          setOrders(orders);

          const productIds = orders.map((order) => order.productid);
          setProductIdArray(productIds);

          setNoOrders(false);
          setLoading(false);

        } else {
          setNoOrders(true);
          setLoading(false);
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
