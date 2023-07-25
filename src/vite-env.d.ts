/// <reference types="vite/client" />

import 'ethers.d.ts';

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}