import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../User/styles/CreateLink.module.css";
import { addProduct } from "../../../lib/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCollectionOwner, CreateSubscription } from "../../../lib/api";
import Link from "next/link";
import Loading from "../../../components/Loading";
import Header from "../../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import useClipboard from "../../../hooks/useClipboard";
// import Green from "../../../components/Alert/Green";



const CreateSub = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [showLink, setShowLink] = useState(false);
  const [ownerProducts, setOwnerProducts] = useState([]);
  const [payLink, setPayLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProductLinks, setShowProductLinks] = useState(false);
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const [multiOwner, setMultiOwner] = useState(false);
  const [showGreen, setShowGreen] = useState(false);
  
  // const productOwner = publicKey.toString();

  const renderGreen = () => {
    // console.log("rendering green");
    // const message = "Subscription successfully created!";
    return console.log('green alert here');
  };

  useEffect(() => {
    if (publicKey) {
      const owner = publicKey.toString();
      const getAllProducts = async () => {
        const products = await getCollectionOwner(owner);
        for (let i = 0; i < products.products.length; i++) {
          if (
            products.products[i].type === "link" ||
            products.products[i].type === "tipjar"
          ) {
            ownerProducts.push(products.products[i]);
          }
        }
      };
      getAllProducts();
      // wait 2 seconds then renderProductLinks
      setTimeout(() => {
        setShowProductLinks(true);
      }, 500);
      console.log(ownerProducts);
    }
  }, [publicKey]);

    // STORE OWNER COLLECTION SETUP
    useEffect(() => {
      // check to see if publicKey.toString() is included in the .env, if it is in multiple keys then add it to the array of it's available symbols
      const availableSymbols = [];
        if (process.env.NEXT_PUBLIC_IKONS_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "IKONS" });
            availableSymbols.push("IKONS")
        }
        if(process.env.NEXT_PUBLIC_MRSC_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "MR_SC" });
            availableSymbols.push("MR_SC")
        }
        if(process.env.NEXT_PUBLIC_COMM_LABS_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "COMM_LABS" });
            availableSymbols.push("COMM_LABS")
        }
        if (process.env.NEXT_PUBLIC_JUNGLECATS_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "JUNGLECATS" });
            availableSymbols.push("JUNGLECATS")
        }
        if(process.env.NEXT_PUBLIC_CREAM_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "CREAM" });
            availableSymbols.push("CREAM")
        }
        if(process.env.NEXT_PUBLIC_SOL_PERMA_BULL_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "SOL_PERMA_BULL" });
            availableSymbols.push("SOL_PERMA_BULL")
        }
        if(process.env.NEXT_PUBLIC_THUGBIRDZ_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "THUGBIRDZ" });
            availableSymbols.push("THUGBIRDZ")
        }
        if(process.env.NEXT_PUBLIC_DESHOEYS_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "DESHOEYS" });
            availableSymbols.push("DESHOEYS")
        }
        if(process.env.NEXT_PUBLIC_UKR_FUND_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "UKR_FUND" });
            availableSymbols.push("UKR_FUND")
        }
        if(process.env.NEXT_PUBLIC_FUEGO_WALLETS.includes(publicKey.toString())) {
            setNewSubscription({ ...newSubscription, symbol: "FUEGO" });
            availableSymbols.push("FUEGO")
        }
        if (process.env.NEXT_PUBLIC_LOGVFX_WALLETS.includes(publicKey.toString())) {
          setNewSubscription({ ...newSubscription, collection: "LOGVFX" });
          availableSymbols.push("LOGVFX")
        }
        if (process.env.NEXT_PUBLIC_SLABZIO_WALLETS.includes(publicKey.toString())) {
          setNewSubscription({ ...newSubscription, collection: "SLABZIO" });
          availableSymbols.push("SLABZIO")
        }
        if(process.env.NEXT_PUBLIC_MEGABOAST_WALLETS.includes(publicKey.toString())) {
          setNewSubscription({ ...newProduct, collection: "MEGAB" });
        }
        setAvailableSymbols(availableSymbols)
        console.log("these are the available sybols",availableSymbols);
        setMultiOwner(availableSymbols.length > 1 ? true : false);
      }, [publicKey]);

    const [newSubscription, setNewSubscription] = useState({
        name: '',
        description: '',
        imageUrl: '',
        quantity: 1,
        price: '',
        // if lifeCycleUnits is === days then * 1, if === months then * 30, if === years then * 365
        lifeCycleDays: 1,
        lifeCycleUnits: 'days',
        token: '',
        reqUserEmail: false,
        reqUserShipping: false,
        owner: '',
        symbol: '',
    });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewSubscription({ ...newSubscription, [name]: value });
  };

  const createSub = async () => {
    try {
      const subscription = { ...newSubscription };
      console.log("Sending sub to api", subscription);
      const response = await CreateSubscription(subscription);
      console.log("Response from api", response);
    //   setPayLink(response.publishProduct.id);
    //   setShowLink(true);
    } catch (error) {
      console.log(error);
    }
  };
  // create copyLink function to copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(payLink);
    alert("Link copied to clipboard");
  };

  const renderLink = () => (
    <div className={styles.link_container}>
      <div className={styles.link_text}>
        <div className={styles.link_title}>Here is your link:</div>
        <div className={styles.link_link}>
          <Link href={`/product/${payLink}`}>
            {/* display last four indexes of payLink */}
            <a>https://ikon.shop/{payLink.slice(-4)}</a>
          </Link>
          <FontAwesomeIcon
            className={styles.copy_icon}
            icon={faCopy}
            style={{
              color: "#000",
              fontSize: "24px",
              marginLeft: "12px",
              marginTop: "-2px",
              cursor: "pointer",
            }}
            onClick={() => useClipboard(`${payLink}`)}
          />
        </div>
      </div>
      {/* button to copy link to clipboard */}
      {/* <div className={styles.link_button}>
            <button className={styles.link_button_text} onClick={() => copyLink()}>
                Copy Link
            </button>
        </div> */}
      {/* button to hide link */}
    </div>
  );

  const renderLoading = () => <Loading />;

  const renderForm = () => (
    <div className={styles.parent_form_container}>
      <div className={styles.background_blur}>
        <div className={styles.faqs}>
          <h1 className={styles.link_header}>Create a Subscription</h1>
        </div>

        <div className={styles.create_product_container}>
          <div className={styles.create_product_form}>
            <div className={styles.form_container}>
              {multiOwner ? ( 
                <div className={styles.flex_row}>
                  {renderSymbolSelector()}
                  </div>) : null }
              <div className={styles.flex_row}>
                <input
                  className={styles.input_name}
                  type="text"
                  placeholder="Title"
                  onChange={(e) => {
                    setNewSubscription({ ...newSubscription, name: e.target.value });
                  }}
                />
              </div>
              <div className={styles.flex_row}>
                <input
                  className={styles.input}
                  // if newProduct.type is tipjar, then disable input
                  // if newProduct.type is tipjar, then set price to 0
                  
                  type="text"
                  placeholder="Set Your Price (i.e. 5.99)"
                  onChange={(e) => {
                    setNewSubscription({ ...newSubscription, price: e.target.value });
                  }}
                />
                <select
                  className={styles.input}
                  onChange={(e) => {
                    setNewSubscription({
                      ...newSubscription,
                      token: e.target.value,
                      owner: publicKey.toString(),
                    });
                    console.log(newSubscription);
                  }}
                >
                  <option value="Select Token">
                    Select Token
                  </option>
                  <option value="usdc">USDC</option>
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
                
              </div>
              <div className={styles.flex_row}>
                  {/* <input
                  className={styles.input}
                  type="text"
                  placeholder="Set Life Cycle (i.e. 30)"
                  onChange={(e) => {
                    setNewSubscription({ ...newSubscription, lifeCycleDays: e.target.value });
                  }}
                /> */}
                {/* for lifeCycleDays give user a dropdown of 1 to 50 and then a second dropdown to select unit of days, weeks, months, years. once both values have been selected, multiply accordingly do set lifeCycleDays in the unit of days */}
                {/* display input selection of days, weeks, months or years */}
                <input
                  className={styles.input_name}
                  type="text"
                  placeholder="Set Life Cycle (i.e. 30)"
                  onChange={(e) => {
                    setNewSubscription({ ...newSubscription, lifeCycleDays: e.target.value });
                  }}
                />
                
              </div>
              <div className={styles.flex_row}>
                <select
                  className={styles.input}

                  onChange={(e) => {
                    setNewSubscription({
                      ...newSubscription,
                      lifeCycleUnits: e.target.value,
                    });
                    console.log(newSubscription);
                  }}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>

                <input
                  className={styles.input}
                  type="number"                  
                  placeholder="# Available"
                  onChange={(e) => {
                    setNewSubscription({
                      ...newSubscription,
                      quantity: e.target.value,
                    });
                    console.log(newSubscription);
                  }}
                />
              </div>

              <div className={styles.flex_row}>
                <input
                  className={styles.input}
                  type="url"
                  placeholder="Image URL ex: https://i.imgur.com/rVD8bjt.png"
                  onChange={(e) => {
                    setNewSubscription({ ...newSubscription, imageUrl: e.target.value });
                  }}
                />
              </div>
              <textarea
                className={styles.text_area}
                placeholder="Description"
                onChange={(e) => {
                  setNewSubscription({
                    ...newSubscription,
                    description: e.target.value,
                  });
                }}
              />
              <div className={styles.flex_row}>
                {/* Checkbox for requiring user email */}
                <div className={styles.checkbox_text}>
                  Email
                  <p id={styles.tool_tip}>Require email info</p>
                </div>
                <div className={styles.checkbox_container}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setNewSubscription({
                        ...newSubscription,
                        reqUserEmail: e.target.checked,
                      });
                    }}
                  />
                </div>
                <div className={styles.checkbox_text}>
                  Shipping
                  <p id={styles.tool_tip}>Require shipping info</p>
                </div>
                <div className={styles.checkbox_container}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      setNewSubscription({
                        ...newSubscription,
                        reqUserShipping: e.target.checked,
                      });
                    }}
                  />
                </div>
              </div>

              <button
                className={styles.button}
                onClick={() => {
                  //   create product and console.log the results
                  // mutlitply lifeCycleDays by lifeCycleUnits and set lifeCycleDays to the result, if lifeCycleUnits is days, then do nothing, if lifeCycleUnits is === months * 30, if lifeCycleUnits is === years * 365
                  if(newSubscription.lifeCycleUnits === "weeks") {
                    setNewSubscription({
                      ...newSubscription,
                      lifeCycleDays: newSubscription.lifeCycleDays * 7,
                    });
                    console.log("weeks");
                  }
                  else if (newSubscription.lifeCycleUnits === "months") {
                    setNewSubscription({
                      ...newSubscription,
                      lifeCycleDays: newSubscription.lifeCycleDays * 30,
                    });
                    console.log("months");
                  } else if (newSubscription.lifeCycleUnits === "years") {
                    setNewSubscription({
                      ...newSubscription,
                      lifeCycleDays: newSubscription.lifeCycleDays * 365,
                    });
                    console.log("years");
                  }
                  console.log(newSubscription)
                  if (newSubscription.price == "" || newSubscription.price == "0") {
                    if (
                      confirm(
                        "Are you sure you want to set your price to 0?"
                      ) == false
                    ) {
                      return;

                      return;
                    }
                  }
                  if (newSubscription.token == "") {
                    alert("Please select a token");
                    return;
                  }
                  if (newSubscription.quantity == 0) {
                    alert("Please select a quantity");
                    return;
                  }
                  if (newSubscription.name == "") {
                    alert("Please enter a name");
                    return;
                  }
                  if (newSubscription.description == "") {
                    alert("Please enter a description");
                    return;
                  } else {
                    createSub();
                  }
                }}
              >
                Create Sub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSymbolSelector = () => (
    // render a selection form from the list of availableSymbols, when the user selects a symbol, set the symbol in the state of newSubscription
    <form>
      MULTI STORE OWNER MODE : 
      <select
        onChange={(e) => {
          setNewSubscription({
            ...newSubscription,
            symbol: e.target.value,
            owner: publicKey.toString(),
          });
          console.log(newSubscription);
        }}
      >
        <option value="Select Store Symbol">
          Select Symbol
        </option>
        {availableSymbols.map((symbol, index) => (
          <option key={index} value={symbol}>{symbol}</option>
        ))}
      </select>
    </form>
  );

  useEffect(() => {
    if (publicKey) {
      setLoading(false);
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
      {loading ? renderLoading() : null}
      {showGreen && renderGreen()}
      {!loading && !showLink ? renderForm() : null}
      {showLink ? renderLink() : null}
    </>
  );
};

export default CreateSub;
