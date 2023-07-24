import {  useEffect } from "react";
import styles from "./Form.module.scss";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useWallet } from "../../hooks/useWallet";

type IProps = {
  connected: boolean;
};

export const Form = ({ connected }: IProps) => {
  const { selectedAddress, selectedBalance } = useWallet();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    defaultValues: { wallet_address: "", balance: "" },
  });

  type UserData = {
    wallet_address: string;
    balance: string;
  };

  useEffect(() => {
    setValue("wallet_address", selectedAddress);
    setValue("balance", selectedBalance);
  }, [selectedAddress, selectedBalance, setValue]);

  const onSubmitHandler = (data: UserData) => {
    const balanceValue = parseFloat(data.balance);
    console.log({ ...data, balance: balanceValue });
    reset();
  };

  if (!connected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
        <input
          disabled={!connected}
          className={styles.input}
          {...register("wallet_address", { required: true, minLength: 10 })}
          type="text"
          placeholder="wallet_address"
          defaultValue={selectedAddress}
        />
        <input
          disabled={!connected}
          className={styles.input}
          {...register("balance", {
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
          {isSubmitting ? "...Loading" : "Send"}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};
