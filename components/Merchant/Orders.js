import React, { useState, useEffect } from "react";
import { getCollectionOrders, GetSingleOrderDetails } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "../../components/Merchant/styles/Orders.module.css";
import Loading from "../../components/Loading";
import OrderDetails from "./OrderDetails";
import {
  getCollectionOwner,
  CheckForCollectionByOwner 
} from "../../lib/api";
import {
  ArrowForward,
  SearchOutline,
  OptionsOutline,
  ArrowBack,
  LogoTwitter,
  LogoDiscord,
  Eye,
  Mail,
  Gift,
  AirplaneOutline,
  CartOutline,
  CashOutline,
  TodayOutline,
} from "react-ionicons";
import { IoArrowUp, IoCheckmark, IoDownloadOutline } from "react-icons/io5";
import * as web3 from "@solana/web3.js";
// import Lottie from 'react-lottie';
// import animationData from './lotties/empty-order-state';

function Orders() {
  const [loading, setLoading] = useState(true);
  const [noOrders, setNoOrders] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [orderDetailView, setOrderDetailView] = useState(false);
  const [orderDetailsId, setOrderDetailsId] = useState(null);
  const [nonFilteredOrders, setNonFilteredOrders] = useState([]);
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [productIdArray, setProductIdArray] = useState([]);
  const { publicKey, connected } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");

  // icon constants
  const sol = "https://img.icons8.com/nolan/512/solana.png";
  const usdc = "/usdc.png";
  const renderCheckmark = () => {
    return (
      <div className={styles.checkmark}>
        <IoCheckmark
          style={{ color: "#14D19E", fontSize: "24px", textAlign: "center" }}
        />
      </div>
    );
  };

  const renderLoading = () => <Loading />;

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
        <OrderDetails id={orderDetailsId} />
      </>
    );
  };

  const renderOrderTable = () => {
    return (
      <div className={styles.orders_container}>
        <table className={styles.orders_table}>
          <tbody>
            <tr styles={{ backgroundColor: "red" }}>
              <th>Order</th>
              <th>
                <TodayOutline
                  color={"#494671"}
                  title={"Created At"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>
                <CashOutline
                  color={"#494671"}
                  title={"Price"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>
                <LogoDiscord
                  color={"#494671"}
                  title={"Discord"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>
                <LogoTwitter
                  color={"#494671"}
                  title={"Twitter"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>
                <Mail
                  color={"#494671"}
                  title={"Email"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>
                <AirplaneOutline
                  color={"#494671"}
                  title={"Fulfilled"}
                  height="20px"
                  width="20px"
                />
              </th>
              <th>Status</th>
              <th>View</th>
            </tr>
            {ownerOrders.length > 0
              ? ownerOrders.map((order, index) => (
                  <tr key={index}>
                    <td data-th="Id" className={styles.orders_td}>
                      <a
                        className={styles.order_id}
                        href={
                          new Date(order.createdAt) > new Date('2023-02-22T00:00:00.000Z')
                            ? `https://solana.fm/tx/${order.orderID}`
                            : `https://solana.fm/address/${order.orderID}`
                        }
                        target="_blank"
                      >
                        {order.id.slice(0, 3) + "..." + order.id.slice(-3)}
                      </a>
                    </td>
                    {/* if order.productid has more than one, then display Multiple Products for a name */}

                    {/* show order.createdAt as a date string mm/dd/yy*/}
                    <td data-th="Created At">
                      <p className={styles.table_text}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>

                    <td data-th="Price">
                      <div className={styles.price_container}>
                        {order.price}{" "}
                        <img
                          className={styles.token_image}
                          src={order.token === "sol" ? sol : usdc}
                        />
                      </div>
                    </td>
                    <td data-th="Discord">
                      {/* if order.discord does not equal "" or null then display a checkmark, else display a - */}
                      {order.discord !== "" && order.discord !== null ? (
                        renderCheckmark()
                      ) : (
                        <div className={styles.blank}>-</div>
                      )}
                    </td>
                    <td data-th="Twitter">
                      {/* if order.twitter does not equal "" or null then display a checkmark, else display a - */}
                      {order.twitter !== "" && order.twitter !== null ? (
                        renderCheckmark()
                      ) : (
                        <div className={styles.blank}>-</div>
                      )}
                    </td>
                    <td data-th="Email">
                      {/* if order.email does not equal "" or null then display a checkmark, else display a - */}
                      {order.email !== "" && order.email !== null ? (
                        renderCheckmark()
                      ) : (
                        <div className={styles.blank}>-</div>
                      )}
                    </td>
                    <td data-th="Shipping">
                      {/* if order.shipping does not equal "" or null then display a checkmark, else display a - */}
                      {order.shipping !== "" && order.shipping !== null ? (
                        renderCheckmark()
                      ) : (
                        <div className={styles.blank}>-</div>
                      )}
                    </td>
                    <td data-th="Status">
                      {/* if order.fulfilled is true then display a checkmark, else display a - */}
                      {order.fulfilled ? (
                        <p className={styles.table_text} style={{ color: "#14D19E" }}>Fulfilled</p>
                      ) : (
                        <p className={styles.table_text} style={{ color: "#FF5E4A" }}>Unfulfilled</p>
                      )}
                    </td>
                    <td data-th="Details">
                      <div
                        className={styles.details_container}
                        onClick={() => {
                          setOrderDetailsId(order.id), setOrderDetailView(true);
                        }}
                      >
                        <Eye
                          color={"#494671"}
                          title={"View"}
                          height="20px"
                          width="20px"
                          align="center"
                          backgroundColor="transparent"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFilterOptions = () => {
    return (
      <div className={styles.filter_button_container}>
        <button
          className={styles.filter_button}
          value="all"
          onClick={handleFilter}
        >
          <span
            className={activeFilter === "all" ? styles.active_filter : null}
          ></span>
          All
        </button>
        <button
          className={styles.filter_button}
          value="true"
          onClick={handleFilter}
        >
          <span
            className={activeFilter === "true" ? styles.active_filter : null}
          ></span>
          Fulfilled
        </button>
        <button
          className={styles.filter_button}
          value="false"
          onClick={handleFilter}
        >
          <span
            className={activeFilter === "false" ? styles.active_filter : null}
          ></span>
          Unfulfilled
        </button>
      </div>
    );
  };

  // const handleFilter should be called when the user clicks on the filter button, it should filter the orders 3 ways by all, fulfilled, and unfulfilled
  const handleFilter = (e) => {
    setActiveFilter(e.target.value);
    setSearchTerm("");
    setOwnerOrders(nonFilteredOrders);
    if (e.target.value === "all") {
      setOwnerOrders(nonFilteredOrders);
    }
    if (e.target.value === "true") {
      const results = nonFilteredOrders.filter((order) => order.fulfilled);
      setOwnerOrders(results);
    }
    if (e.target.value === "false") {
      const results = nonFilteredOrders.filter((order) => !order.fulfilled);
      setOwnerOrders(results);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setOwnerOrders(nonFilteredOrders);
    setActiveFilter("all");

    const results = nonFilteredOrders.filter((order) =>
      order.productid.some((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    console.log(results.length);
    if (results.length > 0) {
      setOwnerOrders(results);
    }
    if (results.length === 0) {
      setOwnerOrders([]);
    }
  };
  
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
      const products = await getCollectionOwner(magicPubKey.toString())
      console.log('products', products.products);
      setOwnerProducts(products.products);
      console.log("userMagicMetadata", userMagicMetadata);
      const getOrders = async () => {
        const orders = await getCollectionOrders(magicPubKey.toString());
        setNonFilteredOrders(orders);
        setOwnerOrders(orders);
        setLoading(false);
      };
      getOrders();
      setLoading(false);
    }
  };

  const renderDisplay = () => (
    <div className={styles.order_container}>
      <div className={styles.searchBarSection}>
        <div className={styles.search_filter}>
          {/* <div className={styles.inputSection}>
            <input
              type="text"
              name="Search"
              placeholder="Search product name"
              onChange={handleSearch}
            />
            <SearchOutline className={styles.searchIcon} />
          </div> */}
          <div className={styles.sortContainer}>
            {!showFilterOptions && (
              <p onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by Status
              </p>
            )}
            <OptionsOutline
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            />
            {showFilterOptions ? renderFilterOptions() : null}
          </div>
        </div>
        <div className={styles.downloadButtonContainer}>
          <div className={styles.primary_cta}>{renderDownloadButton()}</div>
        </div>
      </div>
      {renderOrderTable()}
    </div>
  );

  const renderNoOrders = () => (
    <div className={styles.no_orders}>
      {/* <img src={require("/public/lotties/empty-order-state.gif")} /> */}
      <p>You have no orders</p>
    </div>
  );

  // create button that onClick downloads ownersProducts as a csv file
  const renderDownloadButton = () => {
    const downloadOrders = () => {
      const csvContent = "data:text/csv;charset=utf-8,";
      // create the header row
      const header =
        "Buyer,Produt(s),Email,Shipping,Note,Purchase Date,Order ID";
      const data = ownerOrders.map((order) => {
        const productNames = [];
        // for each product in the order, push the name to the productNames array
        order.productid.map((product) => productNames.push(product.name));
        const shippingString = order.shipping
          ? order.shipping.replace(/,/g, " + ")
          : "";
        console.log("shipping string", order, shippingString);
        return `
          ${order.buyer},${productNames.join(",").replace(/,/g, " + ")},${
          order.email ? order.email : ""
        },${shippingString},${order.note ? order.note : ""},${new Date(
          order.createdAt
        ).toLocaleDateString()},https://solana.fm/tx/${order.orderID}`;
      });
      const csv = csvContent + header + data.join("");
      const encodedUri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "orders.csv".
    };

    return (
      <button className={styles.primary_cta} onClick={downloadOrders}>
        Download
      </button>
    );
  };

  useEffect(() => {
    if (connected) {
      //remove event listener for view_all_orders
      // window.removeEventListener("view_all_orders");
      const owner = publicKey.toString();
      const getOrders = async () => {
        const orders = await getCollectionOrders(owner);
        setNonFilteredOrders(orders);
        setOwnerOrders(orders);
        setLoading(false);
      };
      getOrders();
    }
  }, [publicKey, connected, !orderDetailView]);

  
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
      <div className={styles.orders_container}>
        {loading ? renderLoading() : null}
        {orderDetailView ? renderOrderDetails() : null}
        {!loading && !noOrders && !orderDetailView ? renderDisplay() : null}
        {!loading && noOrders ? renderNoOrders() : null}
      </div>
    </>
  );
}
export default Orders;
