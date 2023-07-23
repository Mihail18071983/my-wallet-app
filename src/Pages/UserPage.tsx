import React from "react";
import styles from "./UserPage.module.scss";
import { Header } from "../components/Header/Header";
import { Form } from "../components/Form/Form";

export const UserPage = () => {
  return (
    <>
      <Header />
      <section className={styles.container}>
        <Form connected={true} />
      </section>
    </>
  );
};
