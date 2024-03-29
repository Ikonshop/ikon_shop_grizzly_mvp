import React, { useState, useEffect } from "react";
// import SingleProductOrderView from "../../components/SingleProductOrderView";
import {
  getCollectionOwner,
  deleteSingleProduct,
  getSingleProductOrders,
  CheckForCollectionByOwner 
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
import * as web3 from "@solana/web3.js";

import EditProduct from "../../components/Product/EditProduct";

function myProducts() {
  const { publicKey } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState();
  const [userEmail, setUserEmail] = useState();
  const [currentWallet, setCurrentWallet] = useState();
  const router = useRouter();
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [lowCountProducts, setLowCountProducts] = useState([]);
  const [singleProductOrderView, setSingleProductOrderView] = useState(false);
  const [ordersToView, setOrdersToView] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProducts, setNoProducts] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [productToEdit, setProductToEdit] = useState();
  const [productToDelete, setProductToDelete] = useState();

  async function getOrders(product) {
    const orders = await getSingleProductOrders(product.id);
    orders.map((order) => ordersToView.push(order));

    // console.log(ordersToView);
    setSingleProductOrderView(true);
  }

  const [show, setShow] = useState(false);

  const renderDeleteModal = () => (
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
            onClick={() => {
              setShow(!show)
              deleteSingleProduct(productToDelete.id);
              const index = ownerProducts.indexOf(productToDelete);
              if (index > -1) {
                ownerProducts.splice(index, 1);
              }
              setOwnerProducts([...ownerProducts]);
            }}
            className={styles.modal_pry_button}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <>
      <div className={styles.owner_product_containter}>
        {show && renderDeleteModal()}
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
            <div key={index} className={styles.product_card} style={{ border: product.quantity < 11 ? '1px solid red' : 'none'}}>
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
                    <p className={styles.product_title} style={{ color: product.quantity < 11 ? 'red' : 'black'}}>{product.name}</p>
                    {/* Price */}
                    <div className={styles.product_price} style={{ color: product.quantity < 11 ? 'red' : 'black'}}>
                      {product.price} {product.token}
                    </div>
                  </div>

                  <div className={styles.remaining}>
                    <p className={styles.product_remaining} style={{ color: product.quantity < 11 ? 'red' : 'black'}}>Remaining:</p>

                    <p className={styles.remaining_amount} style={{ color: product.quantity < 11 ? 'red' : 'black'}}>
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
                        onClick={() =>{ 
                          setShow(true)
                          setProductToDelete(product)
                        }}
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
            href={`https://solana.fm/account/${orders.buyer}?cluster=mainnet`}
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
      var product_data = []
      var low_count_products = []
      for (var i = 0; i < products.products.length; i++) {
        var product = products.products[i]
        if(product.type === 'product'){
          product_data.push(product)
        }
        if(product.type === 'product' && product.quantity < 5){
          low_count_products.push(product)
        }
      }
      setOwnerProducts(product_data);
      setLowCountProducts(low_count_products);
      console.log("userMagicMetadata", userMagicMetadata);
      setLoading(false);
    }
  };

  const checkStandardLogin = async() => {
    if (publicKey) {
      setCurrentWallet(publicKey.toString());
      setUserPublicKey(publicKey.toString());
      
      const data = await CheckForCollectionByOwner(publicKey.toString());
      console.log('data', data);
      const products = await getCollectionOwner(publicKey.toString())
      console.log('products', products.products);
      var product_data = []
      var low_count_products = []
      for (var i = 0; i < products.products.length; i++) {
        var product = products.products[i]
        if(product.type === 'product'){
          product_data.push(product)
        }
        if(product.type === 'product' && product.quantity < 5){
          low_count_products.push(product)
        }
      }
      setOwnerProducts(product_data);
      setLowCountProducts(low_count_products);
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!publicKey) {
      checkMagicLogin();
    }else if(publicKey) {
      checkStandardLogin();
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
