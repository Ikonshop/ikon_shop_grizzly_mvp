import React, { useState, useEffect } from "react";
import MerchantDashboard from "../components/Merchant/Dashboard";
import UserDashboard from "../components/User/Dashboard";

const DashboardPage = () => {
    const [activeDash, setActiveDash] = useState("user");

    useEffect(() => {
        window.addEventListener("toggle-merchant", () => {
            setActiveDash("merchant");
        });
        window.addEventListener("toggle-user", () => {
            setActiveDash("user");
        });
    }, []);

    useEffect(() => {
        console.log('window.location.pathname', window.location.search)
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(
            urlParams.get('userSettings') === 'true'
        ) {
            console.log('userSettings=true')
            setActiveDash("user");
        }
    }, []);

    return (
        <div>
            {activeDash === "user" ? (
                <UserDashboard />
            ) : (
                <MerchantDashboard />
            )}
        </div>
    );
}

export default DashboardPage;