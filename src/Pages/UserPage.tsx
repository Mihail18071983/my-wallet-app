/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect} from "react";
import styles from "./UserPage.module.scss";
import { Header } from "../components/Header/Header";
import { Form } from "../components/Form/Form";
import {  Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { toast } from "react-toastify";
import { useWallet } from "../hooks/useWallet";
import { fetchWalletAddress, fetchWalletBalance } from "../redux/wallet.slice";
import { useAppDispatch } from "../redux/store";

export const UserPage = () => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const { selectedAddress, selectedBalance } = useWallet();
  const [signer, setSigner] = useState<JsonRpcSigner>();


useEffect(() => {

  const handleAccountsChanged = () => {
    if (!signer) return;
    dispatch(fetchWalletAddress(signer));
    dispatch(fetchWalletBalance(signer));
  }

  if(window.ethereum) {
    window.ethereum.on('accountsChanged', handleAccountsChanged)
  }

  return () => {
    if(window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }

}, [dispatch, signer])

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
        const addressAction = fetchWalletAddress(signer);
        const balanceAction = fetchWalletBalance(signer)
        dispatch(addressAction);
        dispatch(balanceAction);
        setIsConnected(true);
      } else {
        toast.warning("Please install MetaMask!");
        setIsConnected(false);
      }
    } catch (err: any) {
      console.log("error", err);
      if (err.code === -32002) {
        console.log("err", err.message);
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
        addressWalet={selectedAddress}
        balanceWallet={selectedBalance}
      />
      {isConnected && (
        <div className={styles.container}>
          <Form isConnected={isConnected} />
        </div>
      )}
    </>
  );
};
