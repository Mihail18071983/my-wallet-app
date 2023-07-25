import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
// import Web3Modal from "web3modal";

interface IProps {
  onConnectWallet: () => void;
  addressWalet: string;
  balanceWallet: string;
}

export const Header = ({ onConnectWallet, addressWalet, balanceWallet }: IProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Logo
        </Link>
        {addressWalet && balanceWallet ? (
          <div>
            <p>{addressWalet}</p>
            <p>{balanceWallet}</p>
          </div>
        ) : (
          <button onClick={onConnectWallet} className={styles.btn}>
            Connect wallet
          </button>
        )}
      </div>
    </header>
  );
};
