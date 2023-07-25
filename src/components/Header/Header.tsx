import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { truncateAddress } from "../../utils/truncateAddress";
// import Web3Modal from "web3modal";

interface IProps {
  onConnectWallet: () => void;
  addressWalet: string;
  balanceWallet: string;
}

export const Header = ({ onConnectWallet, addressWalet, balanceWallet }: IProps) => {
  const truncated = truncateAddress(addressWalet);
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Logo
        </Link>
        {addressWalet && balanceWallet ? (
          <div>
            <p>{truncated}</p>
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
