import React, { useState, useEffect } from "react";
import { GetSingleOrderDetails, UpdateOrder } from "../../lib/api";
import Link from "next/link";
import styles from "../../components/Merchant/styles/OrderDetails.module.css";
import { ArrowForward } from "react-ionicons";
import { IoCopyOutline, IoTimeOutline } from "react-icons/io5";
import Loading from "../Loading";

function OrderDetails({ id }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [isFulfilled, setIsFulfilled] = useState(false);

  const handleChange = (e) => {
    setNewTrackingNumber(e.target.value);
  };

  const handleCopy = (e) => {
    console.log(e);
    //copy to clipboard
    window.navigator.clipboard.writeText(e);
  };

  const handleUpdate = async (id, newTrackingNumber, fulfilled) => {
    const res = await UpdateOrder(id, newTrackingNumber, fulfilled);
    console.log(res);
    setNewTrackingNumber(res.trackingNumber);

    setOrderDetails(res);
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      const order = await GetSingleOrderDetails(id);
      setOrderDetails(order);
      setIsFulfilled(order.fulfilled);
      setNewTrackingNumber(order.trackingNumber);
    };
    getOrderDetails();
  }, [id]);

  return (
    <div>
      {orderDetails ? (
        <div className={styles.order_detail_container}>
          <div className={styles.order_product_details}>
            <div className={styles.product_image}>
              <img
                src={orderDetails.productid[0].imageUrl}
                alt={orderDetails.productid[0].name}
              />
            </div>
            <div className={styles.product_details}>
              <h1 className={styles.product_name}>
                {orderDetails.productid[0].name}
              </h1>
              <p className={styles.order_price_and_token}>
                <span>{orderDetails.price}</span>
                <span style={{ textTransform: "uppercase" }}>
                  {orderDetails.token}
                </span>
              </p>
              <p className={styles.order_date}>
                <IoTimeOutline />
                <span>
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </span>

                <span>
                  {new Date(orderDetails.createdAt).toLocaleTimeString()}
                </span>
              </p>
              <div className={styles.order_id}>
                <span>Order ID: </span>
                <span>{orderDetails.id}</span>
              </div>
              <a
                href={`https://solscan.io/tx/${orderDetails.orderID}`}
                target="_blank"
                className={styles.order_id_link}
              >
                View Transaction Details
                <ArrowForward
                  color="#217BF4"
                  height="15px"
                  width="15px"
                  style={{ transform: "rotate(-45deg)", marginLeft: "10px" }}
                />
              </a>
            </div>
          </div>
          <div className={styles.buyer_details}>
            <div className={styles.buyer_details_left}>
              <div className={styles.buyer_field}>
                <div className={styles.buyer_detail_header}>Wallet Address</div>
                <div className={styles.buyer_detail}>
                  <span>{orderDetails.buyer} </span>
                  <IoCopyOutline
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(orderDetails.buyer)}
                  />
                </div>
              </div>
              <div>
                <div className={styles.buyer_detail_header}>Email Address</div>
                <div className={styles.buyer_detail}>
                  <span>{orderDetails.email} </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.email)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div>
                <div className={styles.buyer_detail_header}>
                  Shipping Details
                </div>
                <div className={styles.buyer_detail_shipping}>
                  <span>{orderDetails.shipping} </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.shipping)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div>
                <div className={styles.buyer_detail_header}>
                  Tracking Number
                </div>
                <div className={styles.buyer_detail}>
                  {/* if there is no orderDetails.trackingNumber then display input that on change setNewTrackingNumber*/}
                  <span>
                    {orderDetails.trackingNumber ? (
                      <div>{orderDetails.trackingNumber}</div>
                    ) : (
                      <div>
                        <input
                          className={styles.tracking_number_input}
                          type="text"
                          value={newTrackingNumber}
                          onChange={handleChange}
                        />
                      </div>
                    )}{" "}
                  </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.trackingNumber)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.buyer_details_right}>
              <div>
                <div className={styles.buyer_detail_header}>Discord</div>
                <div className={styles.buyer_detail}>
                  <span>{orderDetails.discord} </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.discord)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div>
                <div className={styles.buyer_detail_header}>Twitter</div>
                <div className={styles.buyer_detail}>
                  <span>{orderDetails.twitter} </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.twitter)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div>
                <div className={styles.buyer_detail_header}>
                  Note from Buyer
                </div>
                <div className={styles.buyer_detail}>
                  <span>{orderDetails.note} </span>
                  <IoCopyOutline
                    onClick={() => handleCopy(orderDetails.note)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div className={styles.fulfilled}>
                {!isFulfilled ? (
                  <button
                    className={styles.fulfilled_button}
                    onClick={() => {
                      handleUpdate(id, newTrackingNumber, true);
                      setIsFulfilled(true);
                    }}
                  >
                    Mark as fulfilled
                  </button>
                ) : (
                  <button
                    className={styles.unfulfilled_button}
                    onClick={() => {
                      handleUpdate(id, "", false);
                      setIsFulfilled(false);
                    }}
                  >
                    Mark as unfulfilled
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>
            <Loading />
          </h1>
        </div>
      )}
    </div>
  );
}

export default OrderDetails;
