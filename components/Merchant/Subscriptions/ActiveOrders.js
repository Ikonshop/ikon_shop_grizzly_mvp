import React, { useState, useEffect } from 'react';
import {
    GetActiveOrders,
} from '../../../lib/api.js';
import styles from "../../../styles/Merchant.module.css";


const ActiveOrders = (publicKey) => {
    const [activeOrders, setActiveOrders] = useState([]);

    useEffect(() => {
        GetActiveOrders(publicKey).then((res) => {
            setActiveOrders(res.subOrders);
        });
    }, [publicKey]);

    useEffect(() => {
        console.log("active orders", activeOrders);
    }, [activeOrders]);


    return (
        <table className={styles.sub_table}>
                    <h4 className={styles.paylink_header}>Active Orders</h4>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Wallet</th>
                            <th>Purchase Date</th>
                            <th>Expire Date</th>
                            <th>OrderID</th>
                            <th>Actions</th>
                        </tr>
                        {activeOrders.length > 0 ? (
                            
                        activeOrders.map((sub, index) => (
                            <tr key={index}>
                                <td data-th="Name">{sub.sub.name}</td>
                                {/* sub.buyer.owner first 4 and last 4 */}
                                <td data-th="Wallet"><a href={`https://solana.fm/account/${sub.buyer.owner}`} target="_blank" rel="no referrer">{sub.buyer.owner.substring(0, 4)}...{sub.buyer.owner.substring(sub.buyer.owner.length - 4)}</a></td>
                                <td data-th="Purchase Date">{new Date(sub.purchaseDate).toDateString()}</td>
                                {/* sub.expireDate is in ISO format we need to convert it into date format */}
                                <td data-th="Expire Date">{new Date(sub.expireDate).toDateString()}</td>
                                
                                <td data-th="OrderID"><a href={`https://solana.fm/tx/${sub.orderID}`} target="_blank" rel="no referrer">{sub.orderID.slice(0,4)}</a></td>
                                <td data-th="Actions">
                                    <button className={styles.sub_button}>View Order Details</button>
                                </td>
                            </tr>
                        ))): (null)}
                    </tbody>
                </table>
    )
}

export default ActiveOrders;