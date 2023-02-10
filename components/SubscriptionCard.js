import React, { useEffect, useState } from "react";
import styles from "../styles/Product.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SubscriptionCard = (obj) => {
  const sub = obj.sub;

  return (
    <div>
      <div className={styles.product_card}>
        <div className={styles.product_card_content}>
          <div className={styles.product_image_container}>
            <img
              className={styles.product_image}
              src={sub.imageUrl}
              alt={sub.name}
            />
          </div>
          <div className={styles.product_details}>
            <div className={styles.product_text}>
              <div className={styles.product_title}>{sub.name}</div>
              <div className={styles.product_price}>
                {sub.price} {sub.token.toUpperCase()}
              </div>
            </div>
            <div className={styles.purchased}>
              <p className={styles.product_purchased}>Owner:</p>
              <p className={styles.purchased_amount}>{sub.owner.slice(-5)}</p>
            </div>

            <div className={styles.remaining}>
              <p className={styles.product_remaining}>Remaining:</p>
              {sub.quantity > 0 ? (
                <p className={styles.remaining_amount}>{sub.quantity}</p>
              ) : (
                <p className={styles.sold_out}>Sold Out</p>
              )}
            </div>

            <div className={styles.view_details_wrap}>
              <Link
                className={styles.view_details}
                href={`/subscriptions/${sub.id}`}
              >
                <a>View details</a>
              </Link>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  marginLeft: 10,
                  transform: "rotate(-45deg)",
                }}
              />
            </div>
            {/* {sub.quantity > 0 ? (
                            <div className={styles.product_action}>
                                # REMAINING: {sub.quantity}
                            </div>
                        ) : (
                            <div className={styles.product_action}>
                                <div className={styles.sold_out}>
                                    Sold Out
                                </div>
                            </div>
                        )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
