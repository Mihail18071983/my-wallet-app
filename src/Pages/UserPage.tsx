import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import styles from "./UserPage.module.scss";
import { Header } from "../components/Header/Header";
import { Form } from "../components/Form/Form";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { setAddress, setBalance } from "../redux/wallet.slice";

export const UserPage = () => {
  const dispatch = useDispatch();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [addressWalet, setAddressWallet] = useState("");
  const [balanceWallet, setBalanceWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false)

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
        setIsConnected(true);
      } else {
        console.error("Please install MetaMask!");
        setIsConnected(false)
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setIsConnected(false)
    }
  };
  useEffect(() => {
    const getBalance = async () => {
      if (!signer) return;
      const balance = await signer.getBalance();
      const formattedBalance = parseFloat(
        ethers.formatEther(balance.toString())
      ).toFixed(2);
      console.log("formattedBalance",formattedBalance);
      const address = await signer.getAddress();
      dispatch(setAddress(address));
      dispatch(setBalance(formattedBalance));
      setAddressWallet(address);
      setBalanceWallet(formattedBalance);
    };
    getBalance();
  }, [signer, dispatch]);

  return (
    <>
      <Header
        onConnectWallet={connectWallet}
        addressWalet={addressWalet}
        balanceWallet={balanceWallet}
      />
      <div className={styles.container}>
        <Form isConnected={isConnected} />
      </div>
    </>
  );
};
