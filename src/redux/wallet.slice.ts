import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcSigner } from "@ethersproject/providers";
import { ethers } from "ethers";

interface WalletState {
  address: string;
  balance: string;
}

const initialState: WalletState = {
  address: "",
  balance: "",
};

export const fetchWalletAddress = createAsyncThunk(
  "wallet/setAddress",
  async (signer: JsonRpcSigner, thunkAPI) => {
    try {
      const address = await signer.getAddress();
      return address;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const fetchWalletBalance = createAsyncThunk(
  "wallet/setBalance",
  async (signer: JsonRpcSigner, thunkAPI) => {
    try {
      const balance = await signer.getBalance();
      const formattedBalance = parseFloat(
        ethers.formatEther(balance.toString())
      ).toFixed(2);
      return formattedBalance;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletAddress.fulfilled, (state, action) => {
        state.address = action.payload;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      });
  },
});

export default walletSlice.reducer;
