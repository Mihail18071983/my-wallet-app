import { useTypedSelector } from "./useTypedSelector";

export const useWallet = () => {
  const selectedAddress = useTypedSelector((state) => state.wallet.address);
  const selectedBalance = useTypedSelector((state)=>state.wallet.balance)
  return { selectedAddress, selectedBalance };
  
};
