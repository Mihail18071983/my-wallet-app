import styles from "./Header.module.scss";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Logo
        </Link>
        <button className={styles.btn}>Connect wallet</button>
      </div>
    </header>
  );
};
