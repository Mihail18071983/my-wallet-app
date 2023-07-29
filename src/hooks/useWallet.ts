import { useTypedSelector } from "./useTypedSelector";

export const useWallet = () => {
  const selectedAddress = useTypedSelector((state) => state.wallet.address);
  const selectedBalance = useTypedSelector((state) => state.wallet.balance);
  const isBalanceLoading = useTypedSelector((state) => state.wallet.isBalanceLoading);
  const isAddressLoading = useTypedSelector((state) => state.wallet.isAddressLoading);
  return { selectedAddress, selectedBalance, isBalanceLoading, isAddressLoading }; 
};
