import React, {useState, useEffect, useMemo} from "react";
import Magic from "magic-sdk";
import styles from "./styles/QuickActions.module.css";
import * as web3 from "@solana/web3.js";
import { IoCopyOutline, IoTimeOutline, IoCheckmark } from "react-icons/io5";
import { encodeURL, createQR } from '@solana/pay';


const QuickActions = (req) => {
    const [copied, setCopied] = useState(false);
    const [displayQR, setDisplayQR] = useState(false);

    const [trasferToAddress, setTransferToAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState(0);
    const [transferToken, setTransferToken] = useState('SOL');
    const [displayTransfer, setDisplayTransfer] = useState(false);

    console.log('incoming quickActions props: ', req.magicMetadata, req.magicBalance, req.magicUsdcBalance)
    const pubKey = new web3.PublicKey(req.magicMetadata.publicAddress);
    const publicKey = pubKey.toString();
    const usdcAddress = new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    const connection = new web3.Connection(
        web3.clusterApiUrl("mainnet-beta"),
        "confirmed"
    );
    const handleCopy = (e) => {
        console.log(e);
        //copy to clipboard
        window.navigator.clipboard.writeText(e);
        setCopied(true);
    };

    const renderDepositQR = () => {
        //create qr code that uses the publicKey as the recipient that when scanned will create a deposit transaction where the user is the sender and inputs amount
        
        const url = encodeURL({
            amount: 0,
            recipient: pubKey,
            splToken: usdcAddress,
            message: "Magic Deposit on IkonShop"
        });
        // create a qr code with the url that is 200x200
        const qr = createQR(url, 200);
        console.log(qr);

        const element = document.getElementById("qr-code");
        qr.append(element);
        //will need to create a modal that displays the qr code
        return (
            <div className={styles.depositContainer}>
                {displayQR && (<div id="qr-code"></div>)}
                <div className={styles.transferInputRow}>
                    <span>Address: </span> {publicKey.slice(0,4)}...{publicKey.slice(-4)}
                    {copied ? <IoCheckmark className={styles.copyIconCheck}/> : null}
                    {!copied && (
                        <IoCopyOutline className={styles.copyIcon} onClick={() => handleCopy(publicKey)}/>
                    )}
                </div>
            </div>
        )
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [copied]);
    
    return(
        <div className={styles.quickActionsOverlay}>
            <div className={styles.quickActions}>
                <div
                    className={styles.closeButton}
                    onClick={() => window.dispatchEvent(new CustomEvent('closeQuickActions'))}
                >
                    X
                </div>
                <div className={styles.leftContainer}>
                    <div className={styles.addressContainer}>
                        <p className={styles.address}>
                            <span>Address:</span>{publicKey.slice(0,4)}...{publicKey.slice(-4)}
                        </p>
                        {copied ? <IoCheckmark className={styles.copyIconCheck}/> : null}
                        {!copied && (
                            <IoCopyOutline className={styles.copyIcon} onClick={() => handleCopy(publicKey)}/>
                        )}
                    </div>
                    <div className={styles.emailContainer}>
                        <p className={styles.email}>
                            <span>Email:</span>{req.magicMetadata.email}
                        </p>
                    </div>
                    <div className={styles.balanceContainer}>
                        <p className={styles.balance}>{req.magicBalance.toFixed(4)} SOL</p>
                        <p className={styles.balance}>{req.magicUsdcBalance} USDC</p>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.displayOptions}>
                        <p
                            onClick={() => {
                                setDisplayTransfer(!displayTransfer)
                                setDisplayQR(false)
                            }}
                        >
                            {!displayTransfer ? 'Transfer |' : 'Hide |'}
                        </p>
                            
                        <p
                            onClick={() => {
                                setDisplayQR(!displayQR)
                                setDisplayTransfer(false)
                            }}
                        >
                           {!displayQR ? '| Deposit' : '| Hide'}
                        </p>
                    </div>
                    {displayQR && (
                        renderDepositQR()
                    )}
                    {!displayQR && (
                        <div className={styles.transferContainer}>
                         
                                
                          
                            {displayTransfer && (
                                <>
                                    <p
                                        className={styles.transferMax}
                                        onClick={() => setTransferAmount(req.magicBalance - 0.0001)}
                                    >
                                        Set Max
                                    </p>
                                    <div className={styles.transferInputRow}>
                                        <input 
                                            className={styles.transferInput} 
                                            placeholder="Enter Address"
                                            onChange={(e) => setTransferToAddress(e.target.value)}
                                        ></input>
                                    </div>
                                    <div className={styles.transferInputRow}>
                                        <input
                                            className={styles.transferInputSplit}
                                            placeholder="Amount"
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                        ></input>
                                        <select
                                            className={styles.transferInputSplit}
                                            onChange={(e) => setTransferToken(e.target.value)}
                                        >
                                            <option value="SOL">SOL</option>
                                            <option value="USDC">USDC</option>
                                        </select>
                                    </div>
                                    <button 
                                        className={styles.transferButton}
                                    >
                                        Transfer
                                    </button>
                                    <div
                                        className={styles.transferDetails}
                                    >
                                        <p className={styles.detailRow}><span>Recipient:</span> {trasferToAddress}</p>
                                        <p className={styles.detailRow}><span>Gas:</span> 0.0001 SOL</p>
                                        <p className={styles.detailRow}><span>Total:</span> {transferAmount + 0.0001}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuickActions;