import React, { useState, useEffect } from "react";
import styles from "./styles/EditProduct.module.css";

import { EditProductInDB } from "../../lib/api";

const EditProduct = ({ obj }) => {
  console.log("incoming product to edit", obj);

  const [product, setProduct] = useState({
    id: "",
    owner: "",
    collection: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    quantity: 0,
    token: "",
    reqUserEmail: false,
    reqUserShipping: false,
    reqNote: false,
    reqColor: false,
    reqDiscord: false,
    reqTwitter: false,
  });

  useEffect(() => {
    setProduct({
      id: obj.id,
      owner: obj.owner,
      collection: obj.collections[0].symbol,
      name: obj.name,
      description: obj.description,
      price: obj.price,
      imageUrl: obj.imageUrl,
      quantity: obj.quantity,
      token: obj.token,
      reqUserEmail: obj.reqUserEmail,
      reqUserShipping: obj.reqUserShipping,
      reqNote: obj.reqNote,
      reqColor: obj.reqColor,
      reqDiscord: obj.reqDiscord,
      reqTwitter: obj.reqTwitter,
    });
  }, [obj]);

  return (
    <div className={styles.edit_product_modal}>
      <div className={styles.edit_product_form}>
        <div className={styles.edit_product_input}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              borderRadius: "20px",
              marginBottom: "30px",
            }}
          />

          <label>Product Name</label>
          <input
            className={styles.short_input}
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />

          <label>Product Description</label>
          <textarea
            type="text"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />

          <label>Product Price</label>
          <input
            className={styles.short_input}
            type="text"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />

          <label>Product Image</label>
          <input
            className={styles.short_input}
            type="text"
            value={product.imageUrl}
            onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
          />

          <label>Product Quantity</label>
          <input
            className={styles.short_input}
            type="number"
            value={product.quantity}
            onChange={(e) =>
              setProduct({ ...product, quantity: e.target.value })
            }
          />

          <label>Product Token</label>
          <input
            className={styles.short_input}
            type="text"
            value={product.token}
            onChange={(e) => setProduct({ ...product, token: e.target.value })}
          />

          <div className={styles.checkbox_container}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Email</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqUserEmail}
                onChange={(e) =>
                  setProduct({ ...product, reqUserEmail: e.target.checked })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Disord</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqDiscord}
                onChange={(e) =>
                  setProduct({ ...product, reqDiscord: e.target.checked })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Twitter</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqTwitter}
                onChange={(e) =>
                  setProduct({ ...product, reqTwitter: e.target.checked })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Shipping</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqUserShipping}
                onChange={(e) =>
                  setProduct({ ...product, reqUserShipping: e.target.checked })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Note</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqNote}
                onChange={(e) =>
                  setProduct({ ...product, reqNote: e.target.checked })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <label>Color</label>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={product.reqColor}
                onChange={(e) =>
                  setProduct({ ...product, reqColor: e.target.checked })
                }
              />
            </div>
          </div>
        </div>
        <button
          className={styles.submit_product_button}
          onClick={() => EditProductInDB(product)}
        >
          Submit Changes
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
