import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { setAddress, setBalance } from "../../redux/wallet.slice";
import Web3Modal from "web3modal";

export const Header = () => {
  const dispatch = useDispatch();
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
  useEffect(() => {
    const getBalance = async () => {
      if (!signer) return;
      const balance = await signer.getBalance();
      const formattedBalance = parseFloat(
        ethers.formatEther(balance.toString())
      ).toFixed(2);
      const address = await signer.getAddress();
      dispatch(setAddress(address));
      dispatch(setBalance(formattedBalance));
      console.log("Balance: ", formattedBalance);
      console.log("Address: " + address);
    };
    getBalance();
  }, [signer, dispatch]);

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
