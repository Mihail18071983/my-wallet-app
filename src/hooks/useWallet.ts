import { useTypedSelector } from "./useTypedSelector";

export const useWallet = () => {
  const wallet_address = useTypedSelector((state) => state.wallet.address);
  const wallet_balance = useTypedSelector((state)=>state.wallet.balance)
  return { wallet_address, wallet_balance };
  
};
