import { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
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
    formState: { isSubmitting, errors },
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
    if (parsedAmount > 0) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
          to: recipient,
          value: parsedAmount,
        });
        console.log("Transaction successful!", tx);
      } catch (err) {
        console.error(err);
      }
    }
    else console.log("Enter correct amount");
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
          {...register("wallet_address", {
            required: true,
            pattern: {
              value: /^0x[a-fA-F0-9]{40}$/i,
              message: "Please enter a valid address wallet",
            },
          })}
          type="text"
          placeholder="wallet_address"
          defaultValue=""
        />
        {errors.wallet_address && <p>{errors.wallet_address.message}</p>}
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
        {errors.amount && <p>{errors.amount.message}</p>}

        <button className={styles.btn} type="submit">
          {isSubmitting ? "...Loading" : "Transfer"}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};
