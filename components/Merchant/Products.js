import React, { useState, useEffect } from "react";
// import SingleProductOrderView from "../../components/SingleProductOrderView";
import {
  getCollectionOwner,
  deleteSingleProduct,
  getSingleProductOrders,
} from "../../lib/api";
import styles from "../../styles/Product.module.css";
import Header from "../../components/Header";
import Create from "../../components/Merchant/Create";
import { useWallet } from "@solana/wallet-adapter-react";
import Loading from "../../components/Loading";
import { useRouter } from "next/router";
import {
  ArrowForward,
  SearchOutline,
  OptionsOutline,
  TrashBin,
} from "react-ionicons";
import {
  IoArrowBack,
  IoCloseCircleOutline,
  IoEye,
  IoTrashBin,
} from "react-icons/io5";

import EditProduct from "../../components/Product/EditProduct";

function myProducts() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [singleProductOrderView, setSingleProductOrderView] = useState(false);
  const [ordersToView, setOrdersToView] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProducts, setNoProducts] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [productToEdit, setProductToEdit] = useState();

  async function getOrders(product) {
    const orders = await getSingleProductOrders(product.id);
    orders.map((order) => ordersToView.push(order));

    // console.log(ordersToView);
    setSingleProductOrderView(true);
  }

  const [show, setShow] = useState(false);

  const renderProducts = () => (
    <>
      <div className={styles.owner_product_containter}>
        {show && (
          <div className={styles.modal_bg}>
            <div className={styles.modal_}>
              <IoCloseCircleOutline
                style={{ fontSize: "100px", color: "#FF5E4A" }}
              />
              <h4>Are you sure?</h4>
              <p>
                Do you really want to delete this product? This process cannot
                be undone.
              </p>
              <div className={styles.modal_buttons}>
                <button
                  onClick={() => setShow(!show)}
                  className={styles.modal_sec_button}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShow(!show)}
                  className={styles.modal_pry_button}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.searchBarSection}>
          {/* <div className={styles.search_filter}>
            <div className={styles.inputSection}>
              <input type="text" name="Search" placeholder="Search products" />
              <SearchOutline className={styles.searchIcon} />
            </div>
            <div className={styles.sortContainer}>
              <p>Filter by</p>
              <OptionsOutline />
            </div>
          </div> */}
          <div className={styles.add_btn}>
            <button
              className={styles.primary_cta}
              onClick={() => setShowCreate(true)}
            >
              Add New Product
            </button>
          </div>
        </div>
        {/* <div className="products-container"> */}
        <div className={styles.product_list}>
          {ownerProducts.map((product, index) => (
            <div key={index} className={styles.product_card}>
              {/* Product Image */}
              <div className={styles.product_card_content}>
                {/* <div
                    className={styles.view_buyers}
                    onClick={() => getOrders(product)}
                  >
                    <p>View Buyers</p>
                    <ArrowForward
                      style={{
                        color: "#fff",
                        marginTop: "-2px",
                        transform: "rotate(-45deg)",
                        fontSize: "12px",
                      }}
                    />
                  </div> */}
                <div className={styles.product_image_container}>
                  <img
                    className={styles.product_image}
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </div>

                <div className={styles.product_details}>
                  {/* Product Name and Description */}
                  <div className={styles.product_text}>
                    <p className={styles.product_title}>{product.name}</p>
                    {/* Price */}
                    <div className={styles.product_price}>
                      {product.price} {product.token}
                    </div>
                  </div>

                  <div className={styles.remaining}>
                    <p className={styles.product_remaining}>Remaining:</p>

                    <p className={styles.remaining_amount}>
                      {product.quantity}
                    </p>
                  </div>
                  <div className={styles.purchased}>
                    <p className={styles.product_purchased}>Purchased:</p>

                    <p className={styles.purchased_amount}>
                      {product.purchasedCount}
                    </p>
                  </div>
                  <div className={styles.product_card_ctas}>
                    <p
                      className={styles.edit_button}
                      onClick={() => (
                        setShowEdit(true),
                        console.log("product to edit", product),
                        setProductToEdit(product)
                      )}
                    >
                      Edit Product
                    </p>

                    <div className={styles.product_card_icons}>
                      <a
                        key={index}
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        <IoEye
                          style={{
                            fontSize: "20px",
                            color: "#595959",
                          }}
                        />
                      </a>

                      <IoTrashBin
                        style={{
                          marginLeft: "15px",
                          fontSize: "20px",
                          color: "#595959",
                        }}
                        onClick={() => setShow(true)}
                        // onClick={() => {
                        //   // delete and remove index from array
                        //   deleteSingleProduct(product.id);
                        //   const index = ownerProducts.indexOf(product);
                        //   if (index > -1) {
                        //     ownerProducts.splice(index, 1);
                        //   }
                        //   setOwnerProducts([...ownerProducts]);
                        // }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderOrderView = () => (
    <>
      {/* button to clear orders and close */}
      <button
        className={styles.link_button}
        onClick={() => (setOrdersToView([]), setSingleProductOrderView(false))}
      >
        Hide Links
      </button>
      {ordersToView.map((orders, index) => (
        <div key={index} className={styles.order_containter}>
          <a
            className={styles.order_buyer}
            href={`https://solscan.io/account/${orders.buyer}?cluster=mainnet`}
            target="_blank"
          >
            {orders.buyer.slice(0, 4)}...{orders.buyer.slice(-5)}
          </a>
          {orders.email && (
            <a className={styles.order_buyer} href={`mailto:${orders.email}`}>
              Email: {orders.email}
            </a>
          )}
          {orders.shipping && (
            <p className={styles.order_buyer}>Address: {orders.shipping}</p>
          )}
        </div>
      ))}
    </>
  );

  const renderLoading = () => <Loading />;

  const renderNoProducts = () => (
    <div className={styles.no_products}>
      <p>You have no products</p>
    </div>
  );

  const renderCreateComponent = () => {
    return (
      <>
        {/* button to close */}
        <button
          className={styles.link_button}
          onClick={() => setShowCreate(false)}
        >
          Hide Create
        </button>
        <div className={styles.create_component}>
          <Create />
        </div>
      </>
    );
  };

  const renderEditComponent = () => {
    return (
      <>
        {/* button to close */}
        <button
          style={{
            position: "absolute",
            display: "flex",
            alignItem: "center",
            gap: "10px",
            top: "20vh",
            left: "20vw",
            border: "none",
            background: "none",
            color: "black",
            fontSize: "20px",
          }}
          onClick={() => (setShowEdit(false), setProductToEdit({}))}
        >
          <IoArrowBack style={{ marginTop: "5px" }} />
          <p>Back</p>
        </button>
        <div className={styles.create_component}>
          <EditProduct obj={productToEdit} />
        </div>
      </>
    );
  };

  useEffect(() => {
    if (publicKey) {
      const owner = publicKey.toString();
      const getAllProducts = async () => {
        const products = await getCollectionOwner(owner);
        for (let i = 0; i < products.products.length; i++) {
          if (products.products[i].type === "product") {
            ownerProducts.push(products.products[i]);
          }
          if (i == products.products.length - 1) {
            setLoading(false);
            if (ownerProducts == 0) {
              setNoProducts(true);
            }
          }
        }
      };
      getAllProducts();
      // console.log(ownerProducts);
    }
  }, [publicKey]);

  useEffect(() => {
    const checkForKey = () => {
      if (!publicKey) {
        alert("Please connect to app to continue");
      }
    };

    setTimeout(() => {
      checkForKey();
    }, 5000);
  }, []);

  return (
    <>
      {loading && renderLoading()}
      {!loading && !singleProductOrderView && !showCreate && !showEdit
        ? renderProducts()
        : null}
      {singleProductOrderView && !showCreate && renderOrderView()}
      {noProducts && renderNoProducts()}
      {showCreate && renderCreateComponent()}
      {showEdit && renderEditComponent()}
    </>
  );
}
export default myProducts;
