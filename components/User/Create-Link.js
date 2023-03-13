import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../User/styles/CreateLink.module.css";
import { addLink } from "../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCollectionOwner } from "../../lib/api";
import Loading from "../../components/Loading";
import CurrentLinks from "../../components/User/CurrentLinks";
import * as web3 from "@solana/web3.js";
import {
  IoArrowForward,
  IoArrowBack,
  IoCopyOutline,
  IoCheckmark,
} from "react-icons/io5";

const CreateLink = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [userPublicKey, setUserPublicKey] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [payLink, setPayLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    collection: "LINK",
    owner: userPublicKey,
    token: "sol",
    image_url:
      "https://cdn.shopify.com/s/files/1/0648/6274/8930/files/dos2.png",
    description: "",
    quantity: 0,
    reqUserEmail: false,
    reqUserShipping: false,
    type: "link",
    note: "this is a pay link",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCopy = (e) => {
    console.log(e);
    //copy to clipboard
    window.navigator.clipboard.writeText(e);
    setCopied(true);
  };

  const apiToken = "abf2551047e2f3406b79eb5731cc30b9b38f1434";

  const shortenLink = async (link) => {
    const response = await fetch(
      `https://urlmee.com/api?api=${apiToken}&url=${link}&alias=CustomAlias`
    );
    const data = await response.json();
    // console.log('this is the short link data ', data);
    setShortLink(data.short_url);
    // console.log('this is the short link', data.short_url);
  };

  const createProduct = async () => {
    try {
      const product = { ...newProduct };
      // console.log("Sending product to api", product);
      const response = await addLink(product);
      const productId = response.publishProduct.id;
      // console.log("Response from api", response);
      setPayLink(productId);
      setShowLink(true);
    } catch (error) {
      console.log(error);
    }
  };
  // create copyLink function to copy link to clipboard
  const copyLink = () => {
    navigator.clipboard
      .writeText(`https://ikonshop.io/product/${payLink}`)
      .then(() => {
        alert("Copied!");
      });
  };

  const renderLink = () => {
    if (showLink) {
      return (
        <div className={styles.linkContainer}>
          <div className={styles.link}>
            <div className={styles.link_img}>
              <div className={styles.link_img_overlay}></div>
              <img
                src={
                  newProduct.type === "link"
                    ? "/paylink_bg.png"
                    : "/tipjar_bg.png"
                }
              />
            </div>
            <h5>
              Your {newProduct.type === "link" ? "PayRequest" : "Tip Jar"} has
              been created!
            </h5>
            <p>
              Your {newProduct.type === "link" ? "PayRequest" : "Tip Jar"} was
              successfully created and is live.
            </p>
            <div className={styles.share_link}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#727272" }}>
                  Share link
                </span>
                <a
                  className={styles.link_text}
                  onClick={() => {
                    router.push(`/product/${payLink}`);
                  }}
                >
                  {`ikonshop.io/product/${payLink.slice(0, 7)}...`}
                </a>
              </div>
              {copied ? <IoCheckmark className={styles.copyIconCheck} /> : null}
              {!copied && (
                <IoCopyOutline
                  className={styles.copyIcon}
                  onClick={() =>
                    handleCopy(`https://www.ikonshop.io/product/${payLink.id}`)
                  }
                />
              )}
            </div>

            <div className={styles.link_buttons}>
              <button
                className={styles.preview_button}
                onClick={() => {
                  router.push(`/product/${payLink}`);
                }}
              >
                Preview Link
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderLoading = () => <Loading />;

  const renderChooseForm = () => (
    <>
      <div className={styles.payreq_container}>
        <div
          className={styles.paylink_green}
          onClick={() => {
            setNewProduct({
              ...newProduct,
              type: "link",
              quantity: 0,
              price: "0",
            });
            setShowForm(true);
          }}
        >
          <div className={styles.paylink_green_text}>
            <h3>Create a PayRequest</h3>
            <p>Wanna receive payment from your customers or anyone?</p>
          </div>
          <IoArrowForward
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              fontSize: "24px",
              color: "#494671",
            }}
          />
        </div>
        <div
          className={styles.tipjar_pink}
          onClick={() => {
            setNewProduct({
              ...newProduct,
              type: "tipjar",
              quantity: 10000,
              price: "1",
            });

            setShowForm(true);
          }}
        >
          <div className={styles.tipjar_pink_text}>
            <h3>Create a TipJar</h3>
            <p>Wanna receive tips/gifts from your frens or anyone?</p>
          </div>
          <IoArrowForward
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              fontSize: "24px",
              color: "#5c3a6b",
            }}
          />
        </div>
      </div>
      {/* <button
        className={styles.back_button}
        onClick={() => {
          setShowCurrentLinks(!showCurrentLinks);
        }}
        style={{
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        {showCurrentLinks ? "Hide Links" : "View Current Links"}
      </button> */}
      <div className={styles.render_links}>
        <CurrentLinks />
      </div>
    </>
  );

  const renderForm = () => (
    <div className={styles.parent_form_container}>
      {/* back button to setShowForm false */}
      <div className={styles.back_button_container}>
        <button
          className={styles.back_button}
          onClick={() => {
            setShowForm(false);
          }}
        >
          <IoArrowBack /> Back
        </button>
      </div>
      <div className={styles.background_blur}>
        <div className={styles.create_product_container}>
          <div className={styles.create_product_form}>
            <div className={styles.form_container}>
              <div className={styles.form_header}>
                <img
                  src={
                    newProduct.type === "tipjar"
                      ? "/tipjar_head_bg.png"
                      : "/paylink_head_bg.png"
                  }
                />
                {/* <img src="/tipjar_head_bg.png" /> */}
                <h1 className={styles.form_header_text}>
                  Create a{" "}
                  {newProduct.type === "tipjar" ? "Tip Jar" : "Pay Request"}
                </h1>
              </div>
              <div className={styles.flex_row}>
                <div className={styles.col_half}>
                  <input
                    className={styles.input_name}
                    type="text"
                    placeholder="Title"
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value,
                        owner: userPublicKey.toString(),
                      });
                    }}
                  />
                </div>

                <div className={styles.col_half}>
                  {newProduct.type === "link" && (
                    <input
                      className={styles.input_name}
                      // if newProduct.type is tipjar, then disable input
                      disabled={false}
                      // if newProduct.type is tipjar, then set price to 0
                      type="text"
                      placeholder="Set Your Price (i.e. 5.99)"
                      onChange={(e) => {
                        setNewProduct({ ...newProduct, price: e.target.value });
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.flex_row}>
                {newProduct.type === "link" && (
                  <select
                    display={newProduct.type === "tipjar" ? "none" : "flex"}
                    className={newProduct.type != "tipjar" && styles.input}
                    disabled={newProduct.type === "tipjar" ? true : false}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        token: e.target.value,
                        owner: userPublicKey.toString(),
                      });
                      console.log(newProduct);
                    }}
                  >
                    <option value="">
                      {newProduct.type === "tipjar"
                        ? "Tipper Chooses"
                        : "Select Token"}
                    </option>
                    <option
                      value="usdc"
                      // style={{ backgroundImage: "/usdc.png" }}
                    >
                      USDC
                    </option>
                    <option value="sol">SOL</option>
                    <option value="groar">GROAR</option>
                    <option value="dust">DUST</option>
                    <option value="forge">FORGE</option>
                    <option value="creck">CRECK</option>
                    <option value="pesky">PESKY</option>
                    <option value="gmt">GMT</option>
                    <option value="gore">GORE</option>
                    <option value="rain">RAIN</option>
                  </select>
                )}

                {newProduct.type === "link" && (
                  <input
                    className={styles.input}
                    type="number"
                    // if newProduct.type is tipjar, then do not display input

                    disabled={newProduct.type === "tipjar" ? true : false}
                    value={
                      newProduct.type === "tipjar" ? 10000 : newProduct.quantity
                    }
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        quantity: e.target.value,
                      });
                      // console.log(newProduct);
                    }}
                    placeholder="Qty"
                  />
                )}
              </div>

              {/* <div className={styles.flex_row}>
                <input
                  className={styles.input}
                  type="url"
                  placeholder="Image URL ex: https://i.imgur.com/rVD8bjt.png"
                  onChange={(e) => {
                    setNewProduct({ ...newProduct, image_url: e.target.value });
                  }}
                />
              </div> */}
              <textarea
                className={styles.text_area}
                placeholder="Description"
                onChange={(e) => {
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  });
                }}
              />
              {newProduct.type === "link" && (
                <div>
                  {/* Checkbox for requiring user email */}
                  <div className={styles.reqemail_reqshipping}>
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
                      Do you require their Email?
                    </div>
                  </div>
                  <div className={styles.reqemail_reqshipping}>
                    <div className={styles.checkbox_container}>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          setNewProduct({
                            ...newProduct,
                            reqUserShipping: e.target.checked,
                          });
                        }}
                      />
                    </div>
                    <div className={styles.checkbox_text}>
                      Do you require their Shipping info?
                    </div>
                  </div>
                </div>
              )}

              <button
                className={styles.button}
                onClick={() => {
                  //   create product and console.log the results
                  setNewProduct({
                    ...newProduct,
                    owner: userPublicKey.toString(),
                  });

                  if (newProduct.price == "" || newProduct.price == "0") {
                    if (
                      confirm(
                        "Are you sure you want to set your price to 0?"
                      ) == false
                    ) {
                      return;

                      return;
                    }
                  }
                  if (newProduct.token == "") {
                    alert("Please select a token");
                    return;
                  }
                  if (newProduct.quantity == 0) {
                    alert("Please select a quantity");
                    return;
                  }
                  if (newProduct.name == "") {
                    alert("Please enter a name");
                    return;
                  }
                  if (newProduct.description == "") {
                    alert("Please enter a description");
                    return;
                  } else {
                    createProduct();
                  }
                }}
              >
                Create Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (publicKey) {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      if (localStorage.getItem("userMagicMetadata")) {
        const publicAddress = JSON.parse(
          localStorage.getItem("userMagicMetadata")
        ).publicAddress;
        const publicKey = new web3.PublicKey(publicAddress);
        setUserPublicKey(publicKey.toString());
        console.log("public key from local storage", publicKey.toString());
      }
    } else {
      setUserPublicKey(publicKey.toString());
    }
  }, [publicKey]);

  return (
    <>
      {loading ? renderLoading() : null}
      {!loading && !showLink && !showForm ? renderChooseForm() : null}
      {!loading && !showLink && showForm ? renderForm() : null}
      {/* {!loading && !showLink && !showForm && showCurrentLinks && (
        
      )} */}

      {showLink ? renderLink() : null}
    </>
  );
};

export default CreateLink;
