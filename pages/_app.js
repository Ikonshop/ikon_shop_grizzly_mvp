import React, { useMemo, useEffect } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Magic } from "magic-sdk";

import "@solana/wallet-adapter-react-ui/styles.css";

import "../styles/globals.css";
import "../styles/App.css";

const App = ({ Component, pageProps }) => {
  const [user, setUser] = React.useState({ loading: false, user: null });
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;
  
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  useEffect(() => {
    setUser({ loading: true });
    if(window){
      const magic = new Magic("pk_live_8F6C2401BC7E369F");
    
      magic.user.isLoggedIn().then(isLoggedIn => {
        return isLoggedIn ? magic.user.getMetadata().then(userData => setUser(userData)) : setUser({ user: null });
      });
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
