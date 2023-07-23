import { useState } from "react";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import * as Ethers from "ethers";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";

export const Header = () => {
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState<JsonRpcSigner>();
  
  const connectWallet = async () => {
    try {
      const provider = new Web3Provider(window.ethereum);
      if (provider) {
        console.log("Ethereum provider detected!");
        const { chainId } = await provider.getNetwork();
        if (chainId !== 5) {
            throw new Error("Change network to Goerli");
          }
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
      } else {
        console.error("Please install MetaMask!");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Logo
        </Link>
        <button onClick={connectWallet} className={styles.btn}>
          Connect wallet
        </button>
      </div>
    </header>
  );
};
