import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import styles from "./UserPage.module.scss";
import { Header } from "../components/Header/Header";
import { Form } from "../components/Form/Form";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { setAddress, setBalance } from "../redux/wallet.slice";
import { toast } from "react-toastify"

interface IAccount {
  account: string;
}

export const UserPage = () => {
  const dispatch = useDispatch();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [addressWalet, setAddressWallet] = useState("");
  const [balanceWallet, setBalanceWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async ({ account }:IAccount) => {
    try {
      const provider = new Web3Provider(window.ethereum);
      if (provider) {
        toast.success("Ethereum provider detected!");
        const { chainId } = await provider.getNetwork();
        if (chainId !== 5) {
          throw new Error("Change network to Goerli");
        }
        // await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner(account);
       
        setSigner(signer);
        setIsConnected(true);
      } else {
        toast.warning("Please install MetaMask!");
        setIsConnected(false)
      }
    } catch (err) {
      toast.error("Error connecting wallet");
      setIsConnected(false)
    }
  };

  const connectMobileWallet = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    connectWallet(account);
  } else {

    toast.warning('Please install MetaMask!');

  }

}
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
      setAddressWallet(address);
      setBalanceWallet(formattedBalance);
    };
    getBalance();
  }, [signer, dispatch]);

  return (
    <>
      <Header
        onConnectWallet={connectMobileWallet}
        addressWalet={addressWalet}
        balanceWallet={balanceWallet}
      />
      <div className={styles.container}>
        <Form isConnected={isConnected} />
      </div>
    </>
  );
};
