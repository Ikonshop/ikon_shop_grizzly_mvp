import React, { useState, useEffect } from "react";
import {
  getAllPayRequests,
  getAllTipJarLinks,
  deleteSingleProduct,
} from "../../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faFilter, faJar } from "@fortawesome/free-solid-svg-icons";
import styles from "../Merchant/styles/PayRequests.module.css";
import { useRouter } from "next/router";
import {
  IoCopy,
  IoEye,
  IoLinkOutline,
  IoTrashBin,
  IoCheckmark,
} from "react-icons/io5";

export default function PayRequests(publicKey) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [payRequests, setPayRequests] = useState([]);
  const [tipJarLinks, setTipJarLinks] = useState([]);
  const [showPayRequests, setShowPayRequests] = useState(true);
  const [showTipJarLinks, setShowTipJarLinks] = useState(true);

  const handleCopy = (e) => {
    console.log(e);
    //copy to clipboard
    window.navigator.clipboard.writeText(e);
    setCopied(true);
  };

  const renderFilter = () => {
    // when filter is clicked, a dropdown shows up with the options to filter by pay requests or tip jar links, when selected set the state to true or false
    return (
      <div className={styles.filter}>
        <FontAwesomeIcon className={styles.link_icon} icon={faFilter} />
        <select
          className={styles.dropdown}
          onChange={(e) => {
            if (e.target.value === "payRequests") {
              setShowPayRequests(true);
              setShowTipJarLinks(false);
            } else if (e.target.value === "tipJarLinks") {
              setShowPayRequests(false);
              setShowTipJarLinks(true);
            } else {
              setShowPayRequests(true);
              setShowTipJarLinks(true);
            }
          }}
        >
          <option value="all">All</option>
          <option value="payRequests">Pay Requests</option>
          <option value="tipJarLinks">Tip Jar Links</option>
        </select>
      </div>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if(publicKey){
    async function getData() {
      const payRequests = await getAllPayRequests(publicKey);
      setPayRequests(...[payRequests]);
      const tipJarLinks = await getAllTipJarLinks(publicKey);
      setTipJarLinks(tipJarLinks);
    }
    getData();
    }
  }, []);

  return (
    <div>
      <br />
      {renderFilter()}
      <br />
      <div className={styles.links_container}>
        {showPayRequests &&
          payRequests.map((payRequest, index) => (
            <div className={styles.link} key={index}>
              <div className={styles.payreq_col1}>
                <div className={styles.payreq_bg}>
                  <IoLinkOutline
                    style={{
                      transform: "rotate(-45deg)",
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "24px",
                    }}
                    className={styles.link_icon}
                    icon={faLink}
                  />
                </div>
                <div className={styles.link_name}>
                  {payRequest.name.length > 15
                    ? payRequest.name.substring(0, 15) + "..."
                    : payRequest.name}
                </div>
              </div>
              <div className={styles.icon_container}>
                {copied ? (
                  <IoCheckmark className={styles.copyIconCheck} />
                ) : null}
                {!copied && (
                  <IoCopy
                    className={styles.link_icon}
                    onClick={() =>
                      handleCopy(
                        `https://www.ikonshop.io/product/${payRequest.id}`
                      )
                    }
                  />
                )}
                <IoEye
                  className={styles.link_icon}
                  onClick={() => router.push(`/product/${payRequest.id}`)}
                />
                <IoTrashBin
                  className={styles.link_icon}
                  onClick={() => {
                    deleteSingleProduct(payRequest.id),
                      setPayRequests(payRequests.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          ))}
        {showTipJarLinks &&
          tipJarLinks.map((tipJarLink, index) => (
            <div className={styles.link} key={index}>
              <div className={styles.payreq_col1}>
                <div className={styles.tipjar_bg}>
                  <FontAwesomeIcon
                    style={{
                      color: "#fff",
                    }}
                    className={styles.link_icon}
                    icon={faJar}
                  />
                </div>
                <div className={styles.link_name}>
                  {tipJarLink.name.length > 15
                    ? tipJarLink.name.substring(0, 15) + "..."
                    : tipJarLink.name}
                </div>
              </div>
              <div className={styles.icon_container}>
                {copied ? (
                  <IoCheckmark className={styles.copyIconCheck} />
                ) : null}
                {!copied && (
                  <IoCopy
                    className={styles.link_icon}
                    onClick={() =>
                      handleCopy(
                        `https://www.ikonshop.io/product/${tipJarLink.id}`
                      )
                    }
                  />
                )}
                <IoEye
                  className={styles.link_icon}
                  onClick={() => router.push(`/product/${tipJarLink.id}`)}
                />
                <IoTrashBin
                  className={styles.link_icon}
                  onClick={() => {
                    deleteSingleProduct(tipJarLink.id),
                      setTipJarLinks(tipJarLinks.filter((_, i) => i !== index));
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
