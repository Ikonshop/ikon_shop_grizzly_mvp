import React, { useState, useEffect } from 'react';
import { GetInvoicesByOwner } from '../../../lib/api';
import { useWallet } from "@solana/wallet-adapter-react";

const InvoiceOpen = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { publicKey } = useWallet();
    useEffect(() => {
        const getInvoices = async () => {
            const response = await GetInvoicesByOwner(publicKey.toString());
            const data = response.invoices;
            data.forEach((invoice) => {
                console.log('pushing invoice', invoice)
                invoices.push(invoice);
            });
        };
        getInvoices();
        console.log('invoices', invoices)
        setLoading(false);
    }, [publicKey]);
    
    return (
        <>
        {!loading && (
        <table>
            <thead>
                <tr>
                    <th>Invoice ID</th>
                    <th>Invoice Date</th>
                    <th>Invoice Amount</th>
                    <th>Invoice Due Date</th>
                    <th>Invoice Status</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => (
                    <tr key={index}>
                        <td>{invoice.id}</td>
                        <td>{invoice.createdAt}</td>
                        <td>{parseInt(invoice.price)}{invoice.token}</td>
                        <td>{invoice.dueDate}</td>
                        <td>{invoice.fulfilled}</td>
                    </tr>
                ))}
            </tbody>
        </table>    
        )}
        </>
    );
};

export default InvoiceOpen;
