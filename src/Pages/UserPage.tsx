/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import styles from "./UserPage.module.scss";
import { Header } from "../components/Header/Header";
import { Form } from "../components/Form/Form";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { setAddress, setBalance } from "../redux/wallet.slice";
import { toast } from "react-toastify";
// import detectEthereumProvider from "@metamask/detect-provider";

export const UserPage = () => {
  const dispatch = useDispatch();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [addressWalet, setAddressWallet] = useState("");
  const [balanceWallet, setBalanceWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (!signer) return;
        const balance = await signer.getBalance();
        const formattedBalance = parseFloat(
          ethers.formatEther(balance.toString())
        ).toFixed(2);
        const address = await signer.getAddress();
        dispatch(setAddress(address));
        dispatch(setBalance(formattedBalance));
        setAddressWallet(address);
        setBalanceWallet(formattedBalance);
      } catch (err: any) {
        if (err.code === "UNSUPPORTED_OPERATION") {
          toast.warning(
            "MetaMask is locked or no account connected. Please unlock or connect your account."
          );
        } else {
          toast.error("Error fetching balance");
        }
      }
    };
    getBalance();
  }, [signer, dispatch]);

  const connectWallet = async () => {
    try {
      const provider = new Web3Provider(window.ethereum);
      if (provider) {
        let accounts;
        try {
          accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
        } catch (err: any) {
          if (err.code === -32002) {
            toast.error(
              "Already processing account. Please check metamask extension"
            );
            return;
          } else {
            throw err;
          }
        }
        setIsConnected(false);
        if (accounts.length === 0) {
          toast.warning(
            "MetaMask is locked. Please unlock or connect your account."
          );
          setIsConnected(false);
        }
        toast.success("Ethereum provider detected!");
        const { chainId } = await provider.getNetwork();
        if (chainId !== 5) {
          throw new Error("Change network to Goerli");
        }
        const signer = provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
      } else {
        toast.warning("Please install MetaMask!");
        setIsConnected(false);
      }
    } catch (err: any) {
      console.log("error",err);
      if (err.code === -32002) {
          console.log("err",err.message);
        toast.error(
          "Already processing account. Please check metamask extention"
        );
        return;
      }
      toast.error("Error connecting wallet");
      setIsConnected(false);
    }
  };

  return (
    <>
      <Header
        onConnectWallet={connectWallet}
        addressWalet={addressWalet}
        balanceWallet={balanceWallet}
      />
      {isConnected && (
        <div className={styles.container}>
          <Form isConnected={isConnected} />
        </div>
      )}
    </>
  );
};
