import styles from "./Header.module.scss";
import { Link } from "react-router-dom";
import { truncateAddress } from "../../utils/truncateAddress";
import { FaWallet } from "react-icons/fa";

interface IProps {
  onConnectWallet: () => void;
  addressWalet: string;
  balanceWallet: string;
}

export const Header = ({
  onConnectWallet,
  addressWalet,
  balanceWallet,
}: IProps) => {
  const truncated = truncateAddress(addressWalet);
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="https://github.com/Mihail18071983/my-wallet-app" className={styles.logo}>
          CRYPTO
        </Link>
        {addressWalet && balanceWallet ? (
          <div className={styles.wrapper}>
            <p className={styles.address}>
              <span style={{ display: "block", marginBottom:"5px" }}>YOUR WALLET ADDRESS</span>
              <span className={styles.address_value}>{truncated}</span>
              
            </p>
            <p className={styles.balance}>
              <span style={{ display: "block", marginBottom:"5px" }}>YOUR BALANCE</span>
              <span className={styles.balance_value}>{balanceWallet} ETH</span>
            </p>
          </div>
        ) : (
          <button onClick={onConnectWallet} className={styles.btn}>
            Connect wallet
            <FaWallet className={styles.wallet_icon} />
          </button>
        )}
      </div>
    </header>
  );
};
