
import React, { useState, useEffect } from 'react';
// import styles from '../../styles/Graphs.module.css';


import { useRouter } from 'next/router';
import { 
    getTotalSolProductsSold,
    getTotalUsdcProductsSold,
    getTotalSolRev,
    getTotalUsdcRev,
    getProductSoldAmounts,
 } from '../../lib/api';
import { useWallet } from '@solana/wallet-adapter-react';

import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';




function StoreData(owner) {
    const fakeNftDisplay = [
        "https://www.arweave.net/2WNOsLI3Us3d205sZVkvvkgpEIPjrtbgN3c7VrhWxcg?ext=png",
        "https://wvhvakczb3yg4gnsybgdbss4cczqt2fks7zmjus4ftqcxc7kkrqa.arweave.net/tU9QKFkO8G4ZssBMMMpcELMJ6KqX8sTSXCzgK4vqVGA?ext=png",
        "https://www.arweave.net/QAt7CY9wwVOf50cuuqrqNdcTqVAKzgg5Xl8tddOoxb8?ext=png",
    ];
    var ownerWalletNfts = [];
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [solProducts, setSolProducts] = useState([]);
    const [usdcProducts, setUsdcProducts] = useState([]);
    const [linkProducts, setLinkProducts] = useState([]);
    const [physicalProducts, setPhysicalProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [solDataLoaded, setSolDataLoaded] = useState(false);
    const [usdcDataLoaded, setUsdcDataLoaded] = useState(false);
    const [linkDataLoaded, setLinkDataLoaded] = useState(false);    

    const [totalSolProducts, setTotalSolProducts] = useState(0);
    const [totalSolProductsSold, setTotalSolProductsSold] = useState(null);
    const [totalSolRev, setTotalSolRev] = useState(null);

    const [totalUsdcProducts, setTotalUsdcProducts] = useState(0);
    const [totalUsdcProductsSold, setTotalUsdcProductsSold] = useState(null);
    const [totalUsdcRev, setTotalUsdcRev] = useState(null);

    const [totalProductsSoldAmountsIds, setTotalProductsSoldAmountsIds] = useState(null);
    const [totalProductsSoldAmounts, setTotalProductsSoldAmounts] = useState(null);
    const [totalProductsSoldAmountsNames, setTotalProductsSoldAmountsNames] = useState(null);

    const [totalLinkProductsSold, setTotalLinkProductsSold] = useState(0);
    const [totalPhysicalProductsSold, setTotalPhysicalProductsSold] = useState(0);

    const [graphLoading, setGraphLoading] = useState(true);


    

    useEffect(() => {
        async function getProducts() {
        // console.log(owner.publicKey);
        const res = await getTotalSolProductsSold(owner.publicKey);
        const resNumb = parseInt(res);
        setTotalSolProductsSold(resNumb);

        const res2 = await getTotalUsdcProductsSold(owner.publicKey);
        const resNumb2 = parseInt(res2);
        setTotalUsdcProductsSold(resNumb2);

        const res3 = await getTotalSolRev(owner.publicKey);
        const resNumb3 = parseInt(res3);
        setTotalSolRev(resNumb3);

        const res4 = await getTotalUsdcRev(owner.publicKey);
        const resNumb4 = parseInt(res4);
        setTotalUsdcRev(resNumb4);

        const res5 = await getProductSoldAmounts(owner.publicKey);

        

        setTotalProductsSoldAmountsIds(res5.ids);
        setTotalProductsSoldAmounts(res5.purchasedCounts);
        setTotalProductsSoldAmountsNames(res5.names);

        }
        getProducts();


    } , []);

    useEffect(() => {
        setTimeout(() => {
            setGraphLoading(false)
        }, 3000)
        
    } , []);



    ChartJS.register(ArcElement, Tooltip, Legend);

    // GRAPH DATA
    const data = {
        labels: ['SOL', 'USDC'],
        datasets: [
        {
            label: 'Products Sold',
            data: [totalSolProductsSold, totalUsdcProductsSold],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',

            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',

            ],
            borderWidth: 1,
            hoverOffset: 4,
            hoverRadius: 4,
            hoverBorderWidth: 1,
        },
        ],
    };
    const data2 = {
        labels: ['SOL', 'USDC'],
        datasets: [
        {
            label: 'Revenue',
            data: [totalSolRev, totalUsdcRev],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',

            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',

            ],
            borderWidth: 1,
            hoverOffset: 4,
            hoverRadius: 4,
            hoverBorderWidth: 1,
        },
        ],
    };

    // Doughnut
    ChartJS.register(ArcElement, Tooltip, Legend);

const data3 = {
  labels: totalProductsSoldAmountsNames,
  datasets: [
    {
        label: 'Products Sold',
      data: totalProductsSoldAmounts,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
      hoverOffset: 4,
      hoverRadius: 4,
      hoverBorderWidth: 1,
    },

  ],
};



    const renderTotalProductsSoldPie = () => {
        return(
            <>
            <div className={styles.pie}>
            <h5>Products Sold by Type</h5>
            <p>◎ {totalSolProductsSold} || ${totalUsdcProductsSold}</p>
            <Pie data={data} />
            </div>
            <div className={styles.doughnut}>
            <h5>Products Sold by Name</h5>
            <Doughnut 
                data={data3}
                options={{
                    title:{
                        display: true,
                        text: 'Products Sold by Name',
                        
                    },
                    font: {
                        size: 14
                    },
                    legend:{
                        display: true,
                        position: 'right',
                        labels: {
                            // This more specific font property overrides the global property
                            font: {
                                size: 14
                            }
                        }
                    },
                }}
                />
            </div>

            <div className={styles.pie}>
            <h5>Total Revenue by Type</h5>
            <p>◎ {totalSolRev} || ${totalUsdcRev}</p>
            <Pie data={data2} />
            </div>
            
            </>


        )
    };

    return (
        <div className={styles.graphContainer}>
        {/* <Pie data={data} /> */}
        {!graphLoading && renderTotalProductsSoldPie()}
        </div>
        
    );

        

}

export default StoreData;
