import React, { useEffect, useState } from "react";
import styles from "../../styles/Product.module.css";
import Buy from "../Buy.js";
// import SingleProductViewer from './SingleProductViewer.js';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Product({ product }) {
  const { id, name, price, description, imageUrl, owner } = product;
  // create const from last four digits of owner
  const ownerLastFour = owner.slice(-4);
  const [singleProductView, setSingleProductView] = useState(false);
  const [allProductView, setAllProductView] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState(true);
  const { publicKey } = useWallet();

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    // console.log("cart", cart);
    if (cart) {
      // check to see if product is already in cart, if so update quantity
      const productInCart = cart.find((item) => item.id === product.id);
      if (productInCart) {
        alert("Product already in cart");
      } else {
        // if not in cart, add product to cart
        const newCart = [...cart, product];
        localStorage.setItem("cart", JSON.stringify(newCart));
        // console.log("new cart", newCart);
      }
    } else {
      const newCart = [product];
      localStorage.setItem("cart", JSON.stringify(newCart));
      // console.log("new cart", newCart);
    }
    // refresh cart
    const cartRefresh = JSON.parse(localStorage.getItem("cart"));
    // console.log("cartRefresh", cartRefresh);
  };

  useEffect(() => {
    if (product.id) {
      allProducts.push(product);
    }
    setProductSearch(false);
  }, [product]);

  // map through all products and render them
  const renderAllProducts = () => (
    <div>
      {allProducts.map((product) => (
        // Individual Product Container
        <div key={id} className={styles.product_card}>
          {/* Product Image */}
          <div className={styles.product_card_content}>
            <div className={styles.product_image_container}>
              <img className={styles.product_image} src={imageUrl} alt={name} />
            </div>

            <div key={id} className={styles.product_details}>
              {/* Product Name and Description */}
              <div className={styles.product_text}>
                <div className={styles.product_title}>{product.name}</div>
                {/* Price */}
                {/* if product.type is tipjar then render tipJarAmount form */}
                <div className={styles.product_price}>
                  {product.price} {product.token.toUpperCase()}
                </div>
                {/* <div className={styles.product_description}>{product.description}</div> */}
              </div>
              {/* Product Owner's last 4 account #'s*/}
              <div className={styles.purchased}>
                <p className={styles.product_purchased}>Owner:</p>

                <p className={styles.purchased_amount}>
                  {product.owner.slice(-5)}
                </p>
              </div>
              {/* <div className={styles.product_owner}>Owner: {product.owner.slice(-5)}</div> */}
              {/* <div className={styles.purchased}>
                <p className={styles.product_purchased}>Amount Sold:</p>

                <p className={styles.purchased_amount}>
                  {product.purchasedCount}
                </p>
              </div> */}
              <div className={styles.remaining}>
                <p className={styles.product_remaining}>Remaining:</p>
                {product.quantity > 0 ? (
                  <p className={styles.remaining_amount}>{product.quantity}</p>
                ) : (
                  <p className={styles.sold_out}>Sold Out</p>
                )}
              </div>
              {/* <button
                className={styles.cart_button}
                onClick={() => {
                  addToCart(product);
                  console.log("added to cart");
                }}
              >
                Add to Cart
              </button> */}

              <div className={styles.view_details_wrap}>
                <Link
                  className={styles.view_details}
                  href={`/product/${product.id}`}
                >
                  <a>View details</a>
                </Link>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginLeft: 10, transform: "rotate(-45deg)" }}
                />
              </div>

              {/* <div className={styles.view_details_wrap}>
                <button
                  className={styles.view_details}
                  onClick={() => {
                    addToCart(product)
                    // console.log("added to cart");
                  }}
                >
                  Add to Cart
                </button>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginLeft: 10, transform: "rotate(-45deg)" }}
                />
              </div> */}


              {/* {product.quantity > 0 ? (
                <div className={styles.product_action}>
                 # REMAINING: {product.quantity}
                </div>
              ) : (
                <div className={styles.product_action}>
                  <div className={styles.sold_out}>Sold Out</div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* if singleProductView is true then hide all products*/}
      {singleProductView && !allProductView
        ? renderSingleProduct(product)
        : null}
      {!singleProductView && allProductView && !productSearch
        ? renderAllProducts()
        : null}
    </>
  );
}
