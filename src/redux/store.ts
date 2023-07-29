import { configureStore } from "@reduxjs/toolkit";
import {useDispatch} from "react-redux"

import walletReducer from "./wallet.slice";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch:()=>AppDispatch=useDispatch


