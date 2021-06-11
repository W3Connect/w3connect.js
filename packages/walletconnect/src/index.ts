import "./assets/style.css";

import { Provider, Wallet } from "@w3connect.js/wallet";
import WalletConnectProvider from "@walletconnect/web3-provider";

export interface IRPCMap {
  [chainId: number]: string;
}

import i18n, { __ } from "i18n-for-browser";

i18n.configure({
  locales: {
    en: {
      name: "WalletConnect",
      description: "Scan qrCode to connect your wallet",
    },
    "zh-CN": {
      name: "WalletConnect",
      description: "通过扫码连接你的钱包",
    },
  },
  defaultLocale: navigator.language,
});

export class WalletConnectWallet implements Wallet {
  // name: string = "MetaMask";
  // description: string = "Connect to you MetaMask wallet.";

  private provider: WalletConnectProvider;

  constructor(
    rpc: IRPCMap = {
      1: "https://eth-mainnet.token.im",
      3: "https://ropsten.infura.io/v3",
    }
  ) {
    this.provider = new WalletConnectProvider({
      rpc: rpc,
    });
  }
  isValid?: (() => Promise<boolean>) | undefined;

  async disconnect(): Promise<void> {}

  async connect(): Promise<Provider> {
    await this.provider.enable();

    return this.provider as unknown as Provider;
  }

  get name(): string {
    return __("name");
  }

  get description(): string {
    return __("description");
  }
}
