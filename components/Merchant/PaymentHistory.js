import React, { useState, useEffect } from "react";
import { GetOrdersByProductOwner } from "../lib/api";



export default function PaymentHistory(owner) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const orders = await GetOrdersByProductOwner(owner);
            setOrders(orders);
            setLoading(false);
        };
        fetchOrders();
    }, []);
    
    return (
        <div>
            <h1>Payment History</h1>
        </div>
    )
}

