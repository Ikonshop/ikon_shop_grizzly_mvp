import { getAssociatedTokenAddress } from "@solana/spl-token";
const web3 = require("@solana/web3.js");
const connection = new web3.Connection(
    "https://solana-mainnet.g.alchemy.com/v2/7eej6h6KykaIT45XrxF6VHqVVBeMQ3o7",
    "confirmed"
  );



export async function getBalance(pubKey) {
    try{
        const balance = await connection.getBalance(pubKey);
        console.log("balance: ", balance);
        const convertedBalance = balance / 1000000000;
        return convertedBalance;
    } catch (error) {
        console.log('error: ', error)
    }
}

export async function getUsdcBalance(pubKey) {
    const usdcAddress = new web3.PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );
    // get the associated token account of the incoming public key getAssociatedTokenAddress() with the token mint address then get the balance of that account, if there is no account console log no balance
    try {
      const associatedTokenAddress = await getAssociatedTokenAddress(
        usdcAddress,
        pubKey
      );
      console.log(
        "associatedTokenAddress: ",
        associatedTokenAddress.toString()
      );
      const usdcBalance = await connection.getTokenAccountBalance(
        associatedTokenAddress
      );
      console.log("usdcBalance: ", usdcBalance.value.uiAmount);
      const convertedUsdcBalance = usdcBalance.value.uiAmount;
      return convertedUsdcBalance;
    } catch (error) {
      console.log("error: ", error);
    }
}