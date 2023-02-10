import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import styles from "../styles/DashboardHeader.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

// import Head from "next/head";

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <>
      <div className={styles.dash_head}>
        <div className={styles.dash_title}>
          <h2>Sneakerheads Store</h2>
          <p>Welcome fren!</p>
        </div>
        <WalletMultiButton className={styles.disconnect_button} />
      </div>
    </>
  );
}
