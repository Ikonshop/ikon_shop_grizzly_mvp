import React, { useState, useEffect } from "react";
import {
  GetSubscriptionsForWallet,
  CreateSubscription,
  CreateWallet,
  AddWalletToSubscription,
  RemoveWalletFromSubscription,
  CheckWalletSubs,
  CheckWalletSubOrders,
  getCollectionOwner,
  CheckSubsWallets,
  DeleteSubscription,
  GetSubOrdersBySubId,
  GetExpiredSubOrdersForMerchant,
  GetActiveSubOrdersForMerchant,
  GetOnlyActiveSubOrdersForMerchant
} from "../../../lib/api.js";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../../../styles/Merchant.module.css";
import Link from "next/link.js";
import CreateSub from "./CreateSub.js";
import ActiveOrders from "./ActiveOrders.js";
import ExpiredOrders from "./ExpiredOrders.js";
import SubscriptionOrderDetails from "./SubscriptionOrderDetails.js";
import {
  EyeOffOutline,
  EyeOutline,
  TrashOutline,
  PlusCircleOutline,
  AddCircleOutline,
  MinusCircleOutline,
  ArrowBack,
} from "react-ionicons";
import { IoOptionsOutline, IoSearchOutline } from "react-icons/io5";
import { render } from "react-dom";

const Subscriptions = () => {
  const { publicKey, connected } = useWallet();
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [inactiveSubscriptions, setInactiveSubscriptions] = useState([]);
  const [subOrders, setSubOrders] = useState([]);
  const [currentSubscriptions, setCurrentSubscriptions] = useState([]);

  const [collectionSymbol, setCollectionSymbol] = useState("");

  const [showSubOrders, setShowSubOrders] = useState(false);
  const [showCurrentSubscriptions, setShowCurrentSubscriptions] = useState(true);
  const [showActiveSubscriptions, setShowActiveSubscriptions] = useState(false);
  const [showInactiveSubs, setShowInactiveSubs] = useState(false);
  const [showCreateSub, setShowCreateSub] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showActiveOrders, setShowActiveOrders] = useState(false);
  const [showExpiredOrders, setShowExpiredOrders] = useState(false);

  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const [orderDetailView, setOrderDetailView] = useState(false);
  const [orderDetailsId, setOrderDetailsId] = useState(null);

  const [newSubscription, setNewSubscription] = useState({
    name: "",
    description: "",
    price: "",
    lifeCycleDays: 0,
    token: "",
    reqUserEmail: false,
    reqUserShipping: false,
    owner: "",
    symbol: "",
  });

  const handleFilter = (e) => {
    setActiveFilter(e.target.value);
    if (e.target.value === "all") {
      setShowCreateSub(false);
      setShowCurrentSubscriptions(true);
      setShowOrders(false);
    }
    if (e.target.value === "active") {
      setShowCreateSub(false);
      setShowCurrentSubscriptions(false);
      setShowActiveOrders(true);
      
      setShowOrders(true);
    }
    if (e.target.value === "expired") {
      setShowCreateSub(false);
      setShowCurrentSubscriptions(false);
      setShowActiveOrders(false);
      setShowOrders(true); 
    }
  };

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

  const renderFilterOptions = () => {
    
    return (
      <div className={styles.filter_button_container}>
        <button
          className={styles.filter_button}
          value="all"
          onClick={handleFilter}
        >
          <span className={activeFilter === "all" ? styles.active_filter : null}></span>
          All
        </button>
        <button
          className={styles.filter_button}
          value="active"
          onClick={handleFilter}
        >
          <span className={activeFilter === "active" ? styles.active_filter : null}></span>
          Active
        </button>
        <button
          className={styles.filter_button}
          value="expired"
          onClick={handleFilter}
        >
          <span className={activeFilter === "expired" ? styles.active_filter : null}></span>
          Expired
        </button>
      </div>
    );
  };

  const renderOrders = () => {
    const orders = showActiveOrders ? activeSubscriptions : inactiveSubscriptions;
    console.log('currentSubscriptions', currentSubscriptions.subOrders)
    console.log('inactiveSubscriptions', inactiveSubscriptions)
    console.log("orders", orders);
    return (
      <table className={styles.orders_table}>
        <tbody>
          <tr>
            <th>Order</th>
            <th>Wallet</th>
            <th>Subcription</th>
            <th>Purchase Date</th>
            <th>Expire Date</th>
            <th>Email</th>
            <th>Shipping</th>
            <th>View</th>
          </tr>
          {orders
            ? orders.map((order, index) => (
                <tr key={index}>
                  <td data-th="Name">
                    <a
                      href={`https://explorer.solana.com/tx/${order.orderID}?cluster=devnet`}
                      target="_blank"
                    >
                      {order.orderID.slice(0, 4) + "..." + order.orderID.slice(-4)}
                    </a>
                  </td>
                  <td data-th="Wallet">
                    {order.buyer.owner.slice(0, 4) + "..." + order.buyer.owner.slice(-4)}
                  </td>
                  <td data-th="Subcription">{order.sub.name}</td>
                  <td data-th="Purchase Date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td data-th="Expire Date">
                    {new Date(order.expireDate).toLocaleDateString()}
                  </td>
                  <td data-th="Email">{order.email}</td>
                  <td data-th="Shipping">
                    {order.shippingInfo}</td>
                  <td data-th="Actions">
                    {/* <Link href={`/merchant/subscriptions/${order.id}`}>
                      <a>
                        <EyeOutline
                          color={"#000000"}
                          title={"View"}
                          height="20px"
                          width="20px"
                        />
                      </a>
                    </Link> */}
                    <button
                      className={styles.view_button}
                      onClick={() => {
                        setOrderDetailsId(order.id);
                        setOrderDetailView(true);
                      }}
                    >
                      <EyeOutline
                        color={"#000000"}
                        title={"View"}
                        height="20px"
                        width="20px"
                        background="transparent"
                      />
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    );
  };


            

  const renderCurrentSubscriptions = () => {
    console.log("rendering current subs", currentSubscriptions);
    console.log('inactiveSubscriptions', inactiveSubscriptions);
    return (
      <table className={styles.orders_table}>
        {/* <h4 className={styles.paylink_header}>Subscriptions</h4> */}
        <tbody>
          <tr>
            <th>Sub</th>
            <th>Wallets</th>
            <th>Active</th>
            <th>Inactive</th>
            <th>Term</th>
            <th>Cost</th>
            <th>View</th>
          </tr>
          {currentSubscriptions
            ? currentSubscriptions.map((sub, index) => (
                <tr key={index}>
                  <td data-th="Name">{sub.name}</td>
                  {/* set sub.expireDate to date string */}
                  <td data-th="Wallets">
                    {
                      
                      sub.subOrders.length + 
                      // only add inactiveSubscriptions.sub.id === sub.id ? inactiveSubscriptions.length : 0
                      inactiveSubscriptions.filter((sub) => sub.id === sub.id).length
                    }
                  </td>
                  <td data-th="Active">
                    {sub.subOrders.length}
                  </td>
                  <td data-th="Inactive">
                    {inactiveSubscriptions.filter((sub) => sub.id === sub.id).length}
                  </td>

                  <td data-th="Term">{sub.lifeCycleDays} Day(s)</td>
                  <td data-th="Cost">
                    {sub.price} {sub.token.toUpperCase()}
                  </td>
                  <td data-th="Actions">
                    {/* <button
                      onClick={() => {
                        DeleteSubscription(sub.id).then(() => {
                          // console.log("deleted sub");
                          setCurrentSubscriptions((prev) => {
                            const newSubs = { ...prev };
                            delete newSubs[sub.id];
                            return newSubs;
                          });
                        });
                      }}
                    >
                      Delete
                    </button> */}

                    <Link href={`/subscriptions/${sub.id}`} passHref>
                      <a className={styles.action_button}>View</a>
                    </Link>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    );
  };

  const renderCreateSubscription = () => {
    return (
      <div>
        <CreateSub />
      </div>
    );
  };

  useEffect(() => {
    if (connected) {
      async function getSubscriptions() {
        const owner = publicKey.toString();
        // console.log("owner", owner);
        setNewSubscription({ ...newSubscription, owner: owner });

        const data1 = await GetActiveSubOrdersForMerchant(owner);
        const data2 = await GetExpiredSubOrdersForMerchant(owner);
        const data3 = await GetOnlyActiveSubOrdersForMerchant(owner)
        console.log('data1', data1)
        console.log('data2', data2)
        console.log('data3', data3)
        setCurrentSubscriptions(data1);
        setInactiveSubscriptions(data2);
        setActiveSubscriptions(data3);
       
        const data4 = await getCollectionOwner(publicKey);
        setCollectionSymbol(data4.collections[0].symbol);
        // console.log("collection symbol", collectionSymbol);

        if (data4.collections[0].symbol) {
          setNewSubscription({ ...newSubscription, symbol: collectionSymbol });
          // console.log("new sub", newSubscription);
        }
      }
      getSubscriptions();
    }
  }, [publicKey, connected]);

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <div className={styles.order_container}>
        <div className={styles.searchBarSection}>
          <div className={styles.search_filter}>
            <div className={styles.inputSection}>
              <input type="text" name="Search" placeholder="Search products" />
              <IoSearchOutline className={styles.searchIcon} />
            </div>
            <div className={styles.sortContainer}>
            {!showFilterOptions && <p onClick={()=>setShowFilterOptions(!showFilterOptions)}>Filter by </p>}
              <IoOptionsOutline onClick={()=>setShowFilterOptions(!showFilterOptions)}/>
              {showFilterOptions && renderFilterOptions()}
            </div>
          </div>
          <div className={styles.add_btn}>
            <button 
              className={styles.primary_cta}
              onClick={() => {
                setShowCreateSub(true);
                setShowCurrentSubscriptions(false);
                setShowOrders(false);
              }}
            >
              Create Subscription
            </button>
          </div>
        </div>
        {showCurrentSubscriptions &&
          !showOrders &&
          !showCreateSub &&
          renderCurrentSubscriptions()}
        {showOrders &&
          !showCurrentSubscriptions &&
          !showCreateSub &&
          renderOrders()}
        {orderDetailView && renderOrderDetails()}
        {showCreateSub &&
          !showOrders &&
          !showCurrentSubscriptions &&
          renderCreateSubscription()}
      </div>
      {!publicKey && <h2>Connect your wallet to view your subscriptions</h2>}
      {/* {publicKey && (
        <h2>Subscriptions for {publicKey.toString().slice(0, 4)}...</h2>
      )} */}
      {/* <div className="sub_button_container"> */}
      {/* {publicKey && (
          <div
            className="sub_button"
            onClick={() => {
              setShowInactiveSubs(false),
                setShowCreateSub(false),
                setShowCurrentSubscriptions(false),
                setShowActiveSubscriptions(!showActiveSubscriptions);
            }}
          >
            <EyeOutline />
            <span>
              {" "}
              {showActiveSubscriptions ? "Hide" : "Show"} Active Subscriptions
            </span>
          </div>
        )} */}
      {/* {publicKey && (
          <div
            className="sub_button"
            onClick={() => {
              setShowCurrentSubscriptions(false),
                setShowActiveSubscriptions(false),
                setShowCreateSub(false),
                setShowInactiveSubs(!showInactiveSubs);
            }}
          >
            <EyeOffOutline />
            <span>
              {" "}
              {showInactiveSubs ? "Hide" : "Show"} Inactive Subscriptions
            </span>
          </div>
        )} */}
      {/* {publicKey && (
          <div
            className="sub_button"
            onClick={() => {
              setShowCurrentSubscriptions(false),
                setShowActiveSubscriptions(false),
                setShowInactiveSubs(false),
                setShowCreateSub(!showCreateSub);
            }}
          >
            <AddCircleOutline />
            <span> {showCreateSub ? "Hide" : "Show"} Create Subscription</span>
          </div>
        )} */}
      {/* </div> */}

      {/* !showInactiveSubs && !showActiveSubscriptions && !showCurrentSubscriptions && */}

      {/* TODO SHOW INACTIVE AND SHOW WALLET'S PERSONAL ORDERS THEN DUPLICATE THAT TO USER DASH */}
    </div>
  );
};

export default Subscriptions;
