import * as React from "react";
import styles from "./Form.module.scss";
import { useForm } from "react-hook-form";

import { DevTool } from "@hookform/devtools";

export const Form = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { wallet_address: "", amount: "0.01" },
  });

  type UserData = {
    wallet_address: string;
    amount: string;
  };
  const onSubmitHandler = (data: UserData) => {
    const amountValue = parseFloat(data.amount );
    console.log({ ...data, amount: amountValue });
    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={styles.form}>
        <input
          className={styles.input}
          {...register("wallet_address", { required: true, minLength: 10 })}
          type="text"
          placeholder="wallet_address"
        />
        <input
          className={styles.input}
          {...register("amount", {
            required: true,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid amount with up to two decimal places.",
            },
          })}
          type="text" 
          placeholder="amount"
        />
        <button className={styles.btn} type="submit">
          {isSubmitting ? "...Loading" : "Send"}
        </button>
      </form>
      <DevTool control={control} />
    </>
  );
};
