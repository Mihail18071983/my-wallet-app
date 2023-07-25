import { useEffect } from "react";
import {  Web3Provider } from "@ethersproject/providers";
import styles from "./Form.module.scss";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";

const RECIPIENT_WALLET = "0xbC78292cE96C876156212069069Ef9563CdE3796";

type IProps = {
  isConnected: boolean;
};

export const Form = ({ isConnected }: IProps) => {
  const { selectedAddress, selectedBalance } = useWallet();
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      wallet_address: RECIPIENT_WALLET,
      amount: "",
    },
  });

  type UserData = {
    wallet_address: string;
    amount: string;
  };

  useEffect(() => {
    setValue("wallet_address", RECIPIENT_WALLET);
    setValue("amount", "0.00");
  }, [selectedAddress, selectedBalance, setValue]);

  const onSubmitHandler = async (data: UserData) => {
    const recipient = data.wallet_address;
    const amount = data.amount;
    const parsedAmount = ethers.parseEther(amount);
    try {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parsedAmount
      })
      console.log("Transaction successful!", tx);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
        <h2>Transfer form</h2>
        <label htmlFor="wallet_address">RECEIVER ADDRESS</label>
        <input
          id="wallet_address"
          disabled={!isConnected}
          className={styles.input}
          {...register("wallet_address", { required: true, minLength: 10 })}
          type="text"
          placeholder="wallet_address"
          defaultValue=""
        />
        <label htmlFor="amount">AMOUNT TO SEND</label>
        <input
          id="amount"
          disabled={!isConnected}
          className={styles.input}
          {...register("amount", {
            required: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message:
                "Please enter a valid balance with up to two decimal places.",
            },
          })}
          type="text"
          placeholder="balance"
          defaultValue={selectedBalance}
        />

        <button className={styles.btn} type="submit">
          {isSubmitting ? "...Loading" : "Transfer"}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};
