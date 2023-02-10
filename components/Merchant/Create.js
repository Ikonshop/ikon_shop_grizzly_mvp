import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/CreateProduct.module.css";
import { addProduct } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Container from "react-bootstrap/Container";
import Product from "../../components/Product/Product"
import { CloudUploadOutline } from "react-ionicons";

const CreateProduct = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // const productOwner = publicKey.toString();

  function getAccessToken() {
    const NEXT_PUBLIC_WEB3STORAGE_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI4NDQyNzlkMDRmRDc2NDJDMUQyNzZhQkRmNDI3ZDBkOWJmMGU0NzkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTM0MzIxMDY3MjAsIm5hbWUiOiJkZXYifQ.gFBojcATcuBQeXse4O1OAVEIrrmdKPxyHlK83AaqZrQ";
    return NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    collection: "ALL_PROD",
    owner: "",
    token: "",
    image_url:
      "https://cdn.shopify.com/s/files/1/0648/6274/8930/files/dos2.png",
    description: "no description",
    quantity: 100,
    reqUserEmail: false,
    reqUserShipping: false,
    reqColor: false,
    reqNote: false,
    type: "product",
  });
  const [file, setFile] = useState({ filename: "null", hash: "null" });
  const [uploading, setUploading] = useState(false);

  // STORE OWNER COLLECTION SETUP
  useEffect(() => {
    // if public key is in ikon store owners, set collection to ikon
    if (process.env.NEXT_PUBLIC_IKONS_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "IKONS" });
    }
    if(process.env.NEXT_PUBLIC_MRSC_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "MR_SC" });
    }
    if(process.env.NEXT_PUBLIC_COMM_LABS_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "COMM_LABS" });
    }
    if (process.env.NEXT_PUBLIC_JUNGLECATS_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "JUNGLECATS" });
    }
    if(process.env.NEXT_PUBLIC_CREAM_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "CREAM" });
    }
    if(process.env.NEXT_PUBLIC_SOL_PERMA_BULL_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "SOL_PERMA_BULL" });
    }
    if(process.env.NEXT_PUBLIC_THUGBIRDZ_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "THUGBIRDZ" });
    }
    if(process.env.NEXT_PUBLIC_DESHOEYS_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "DESHOEYS" });
    }
    if(process.env.NEXT_PUBLIC_UKR_FUND_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "UKR_FUND" });
    }
    if(process.env.NEXT_PUBLIC_FUEGO_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "FUEGO" });
    }
    if (process.env.NEXT_PUBLIC_LOGVFX_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "LOGVFX" });
    }
    if(process.env.NEXT_PUBLIC_SLABZIO_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "SLABZIO" });
    }
    if(process.env.NEXT_PUBLIC_LASERED_DESIGN_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "LDESIGNS" });
    }
    if(process.env.NEXT_PUBLIC_MEGABOAST_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "MEGAB" });
    }
    if(process.env.NEXT_PUBLIC_ATADIA_WALLETS.includes(publicKey.toString())) {
      setNewProduct({ ...newProduct, collection: "ATADIA" });
    }
  }, []);

 

  const createProduct = async () => {
    try {
      // Combine product data and file.name
      const product = { ...newProduct, ...file };
      console.log("Sending product to api", product);
      const response = await addProduct(product);
      console.log("Response from api", response);
      if (response.publishProduct.id) {
        if (window.confirm("Product Created! Would you like to see it?")) {
          {
            router.push(`/product/${product.id}`);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
      alert("Error creating product" + error);
    }
  };

  const renderLoading = () => <Loading />;

  // render a preview of the newProduct mimicking the product card

   
        

  const renderForm = () => (
    <>
      
      <Container>
        <div className={styles.background_blur}>
          {/* <div className={styles.faqs}>
            <h1>
              Sell <span>digital/physical</span> products to your community.
            </h1>
          </div> */}
          <div className={styles.create_product_container}>
            <div className={styles.create_product_form}>
              <div className={styles.form_container}>
                {/* <div className={styles.file_input}>
                <div className={styles.upload_text}>
                <CloudUploadOutline style={{
                  fontSize: "50px"
                }} />
                <p>Click here to Upload Files</p>
                </div>
                <input
                  type="file"
                  className={styles.input}
                  accept=".png,.zip,.rar,.7zip,.mp3,.jpg,.jpeg,.gif,.mp4,.avi,.mov,.wmv,.flv,.mkv,.webm,.m4v"
                  placeholder="File"
                  onChange={onChange}
                />
                {file.name != null && (
                  <p className="file-name">{file.filename}</p>
                )}
                </div> */}

                  <div className={styles.text_input}>
                <div className={styles.flex_row}>
                  <input
                    className={styles.input_name}
                    type="text"
                    placeholder="Product Name"
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, name: e.target.value });
                    }}
                  />
                </div>
                <input
                  className={styles.input_name}
                  type="text"
                  placeholder="Amount"
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, price: e.target.value });
                  }}
                />
                <div className={styles.flex_row}>
                  <select
                    className={styles.input}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        token: e.target.value,
                        owner: publicKey.toString(),
                      });
                    }}
                  >
                    <option value="">Token</option>
                    <option value="usdc">USDC</option>
                    <option value="sol">SOL</option>
                    <option value="groar">GROAR</option>
                    <option value="forge">FORGE</option>
                    <option value="dust">DUST</option>
                    <option value="creck">CRECK</option>
                    <option value="pesky">PESKY</option>
                    <option value="gmt">GMT</option>
                    <option value="gore">GORE</option>
                  </select>

                  <input
                    className={styles.input}
                    type="number"
                    placeholder="# Available"
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        quantity: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className={styles.flex_row}>
                  <input
                    className={styles.input}
                    type="url"
                    placeholder="Image URL ex: https://i.imgur.com/rVD8bjt.png"
                    onChange={(e) => {
                      
                        setNewProduct({
                          ...newProduct,
                          image_url: e.target.value,
                        });
                      
                    }}
                  />
                </div>
                <textarea
                  className={styles.text_area}
                  placeholder="Product description"
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      });
                    }
                  }}
                />
                <div className={styles.flex_row}>
                  {/* Checkbox for requiring user email */}
                  <div className={styles.checkbox_text}>Require Email</div>
                  <div className={styles.checkbox_container}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          reqUserEmail: e.target.checked,
                        });
                      }}
                    />
                  </div>
                  <div className={styles.checkbox_text}>
                    Require Shipping Info
                  </div>
                  <div className={styles.checkbox_container}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          reqUserShipping: e.target.checked,
                        });
                        console.log(newProduct);
                      }}
                    />
                  </div>
                  <div className={styles.checkbox_text}>
                    Require Color Selection
                  </div>
                  <div className={styles.checkbox_container}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          reqColor: e.target.checked,
                        });
                        console.log(newProduct);
                      }}
                    />
                  </div>
                  <div className={styles.checkbox_text}>
                    User Note
                  </div>
                  <div className={styles.checkbox_container}>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setNewProduct({
                          ...newProduct,
                          reqNote: e.target.checked,
                        });
                        console.log(newProduct);
                      }}
                    />
                  </div>
                </div>
                
                <button
                  className={styles.button}
                  onClick={async () => {
                    // Create product and display the product link
                    createProduct();
                  }}
                  disabled={uploading}
                >
                  Create Product
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

    </>
  );

  useEffect(() => {
    if (publicKey) {
      setLoading(false);
    }
  }, [publicKey]);

  return (
    <>
      {loading ? renderLoading() : renderForm()}
      <div className={styles.faqs}>
        Live Preview
      </div>
      <div className={styles.create_product_container}>
              {/* Product Image */}
              <div className={styles.product_card_content}>
                <div className={styles.product_image_container}>
                  <img
                    className={styles.product_image}
                    src={newProduct.image_url}
                    alt={newProduct.name}
                  />
                </div>

                <div className={styles.product_details}>
                  {/* Product Name and Description */}
                  <div className={styles.product_text}>
                    <div className={styles.product_title}>{newProduct.name}</div>
                    {/* Price */}
                    {/* if product.type is tipjar then render tipJarAmount form */}
                    <div className={styles.product_price}>
                      {newProduct.price} {newProduct.token.toUpperCase()}
                    </div>
                    {/* <div className={styles.product_description}>{product.description}</div> */}
                  </div>
                  {/* Product Owner's last 4 account #'s*/}
                  <div className={styles.purchased}>
                    <p className={styles.product_purchased}>Owner:</p>

                    <p className={styles.purchased_amount}>
                      {newProduct.owner.slice(-5)}
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

                    <p className={styles.remaining_amount}>{newProduct.quantity}</p>
                  </div>

                  

                  {newProduct.quantity > 0 ? (
                    <div className={styles.product_action}>
                    # REMAINING: {newProduct.quantity}
                    </div>
                  ) : (
                    <div className={styles.product_action}>
                      <div className={styles.sold_out}>Sold Out</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
      
    </>
  )
};

export default CreateProduct;