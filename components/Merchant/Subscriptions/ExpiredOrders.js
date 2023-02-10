import React, { useState, useEffect } from 'react';
import {
    GetExpiredOrders,
} from '../../../lib/api.js';
import SubscriptonOrderDetails from './SubscriptionOrderDetails.js';
import styles from "../../../styles/Merchant.module.css";


const ExpiredOrders = (publicKey) => {
    const [expiredOrders, setExpiredOrders] = useState([]);
    const [orderDetailView, setOrderDetailView] = useState(false);
    const [orderDetailsId, setOrderDetailsId] = useState(null);


    const renderOrderDetails = () => {
        return (
          <>
            <div className={styles.order_details_header}>
              <button
                className={styles.backButton}
                onClick={() => {
                  setOrderDetailView(false), setOrderDetailsId(null);
                }}
              >
                <ArrowBack
                  color={"#2B2B2B"}
                  title={"Back"}
                  height="18px"
                  width="18px"
                />
                <span>Back</span>
              </button>
              <h4>Order Details</h4>
            </div>
            <SubscriptionOrderDetails id={orderDetailsId} />
          </>
        );
      };

    useEffect(() => {
        GetExpiredOrders(publicKey).then((res) => {
            setExpiredOrders(res.subOrders);
        });
    }, [publicKey]);

    useEffect(() => {
        console.log("active orders", expiredOrders);
    }, [expiredOrders]);


    return (
        <table className={styles.sub_table}>
                    <h4 className={styles.paylink_header}>Expired Orders</h4>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Wallet</th>
                            <th>Purchase Date</th>
                            <th>Expire Date</th>
                            <th>OrderID</th>
                            <th>Actions</th>
                        </tr>
                        {expiredOrders.length > 0 ? (
                            
                        expiredOrders.map((sub, index) => (
                            <tr key={index}>
                                <td data-th="Name">{sub.sub.name}</td>
                                {/* sub.buyer.owner first 4 and last 4 */}
                                <td data-th="Wallet"><a href={`https://solscan.io/account/${sub.buyer.owner}`} target="_blank" rel="no referrer">{sub.buyer.owner.substring(0, 4)}...{sub.buyer.owner.substring(sub.buyer.owner.length - 4)}</a></td>
                                <td data-th="Purchase Date">{new Date(sub.purchaseDate).toDateString()}</td>
                                {/* sub.expireDate is in ISO format we need to convert it into date format */}
                                <td data-th="Expire Date">{new Date(sub.expireDate).toDateString()}</td>
                                
                                <td data-th="OrderID"><a href={`https://solscan.io/tx/${sub.orderID}`} target="_blank" rel="no referrer">{sub.orderID.slice(0,4)}</a></td>
                                <td data-th="Actions">
                                    <button
                                        className={styles.view_button}
                                        onClick={() => {
                                            setOrderDetailsId(sub.id);
                                            setOrderDetailView(true);
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))): (null)}
                    </tbody>
                </table>
    )
}

export default ExpiredOrders;