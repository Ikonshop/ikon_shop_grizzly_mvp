import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import {
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock } from "@fortawesome/free-solid-svg-icons";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

config.autoAddCss = false;

export default function Powered() {
  return (
    <MDBContainer className="py-5 text-center">
      <h2 className="powered_title">Powered by Ikons</h2>
      <p className="powered_p">Building native web3 payment solutions.</p>
      <MDBTable
        responsive
        striped
        className="text-successtable-border border-light powered_table_text"
      >
        <MDBTableHead className="border-light">
          <tr>
            <th scope="col"></th>
            <th scope="col">
              <strong>IkonBasic</strong>
            </th>
            <th scope="col">
              <strong>IkonPro</strong>
            </th>
            <th scope="col">
              <strong>IkonEnterprise</strong>
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              A Web3 Store that accepts SPL token
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Web3 Connectivity
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              A Native Platform with Merchant tools
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Connected Domain and URL
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              A Store Template
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Tokengated Products/Services (Optional)
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              A Checkout Cart
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Analytics & Reports
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Access tools, plugins for e-commerce.
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              DropShipping tools and API access
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Design customization (limited to backgrounds, colors, elements)
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Customization in Design and functionality in Payments
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" style={{ textAlign: "left" }}>
              Talk to us and tell us your requirements, we can build all of it
            </th>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faLock}
              />
            </td>
            <td>
              <FontAwesomeIcon
                // className={styles.side_icon}
                icon={faCheck}
                style={{ color: "#42ED72", fontSize: "18px" }}
              />
            </td>
          </tr>
          {/* <tr>
            <td></td>
            <td className="fw-bold">Free</td>
            <td className="fw-bold">$99/mo</td>
            <td className="fw-bold">$179/mo</td>
          </tr> */}
          {/* <tr>
            <th></th>
            <th>
              <MDBBtn>Sign-up</MDBBtn>
            </th>
            <th>
              <MDBBtn>Buy Now</MDBBtn>
            </th>
            <th>
              <MDBBtn>Buy Now</MDBBtn>
            </th>
          </tr> */}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}
