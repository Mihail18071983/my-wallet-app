import { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import styles from "./Form.module.scss";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useWallet } from "../../hooks/useWallet";
import { ethers } from "ethers";
import { ColorRing } from "react-loader-spinner";

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
    } else console.log("Enter correct amount");
  };

  if (!isConnected) {
    return <p className={styles.message}>Please, connect your wallet!</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
        <h2 className={styles.title}>TRANSFER FORM</h2>
        <label className={styles.address} htmlFor="wallet_address">
          RECEIVER ADDRESS
          <input
            id="wallet_address"
            disabled={!isConnected}
            className={styles.input}
            {...register("wallet_address", {
              required: true,
              pattern: {
                value: /^0x[a-fA-F0-9]{40}$/i,
                message: "Please enter a valid address wallet!",
              },
            })}
            type="text"
            placeholder="wallet_address"
            defaultValue=""
          />
          {errors.wallet_address && (
            <p className={styles.errMessage}>{errors.wallet_address.message}</p>
          )}
        </label>

        <label className={styles.balance} htmlFor="amount">
          AMOUNT TO SEND
          <input
            id="amount"
            disabled={!isConnected}
            className={styles.input}
            {...register("amount", {
              required: true,
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message:
                  "Please enter a valid balance with up to two decimal places!",
              },
            })}
            type="text"
            placeholder="balance"
            defaultValue={selectedBalance}
          />
          {errors.amount && (
            <p className={styles.errMessage}>{errors.amount.message}</p>
          )}
        </label>

        <button className={styles.btn} type="submit">
          {isSubmitting ? (
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            "Transfer"
          )}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};
