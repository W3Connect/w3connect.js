import "./assets/style.css";

import { Provider, Wallet } from "@w3connect.js/wallet";
import detectEthereumProvider from "@metamask/detect-provider";

import i18n, { __ } from "i18n-for-browser";

i18n.configure({
  locales: {
    en: {
      name: "MetaMask",
      description: "Connect to you MetaMask wallet",
    },
    "zh-CN": {
      name: "MetaMask",
      description: "点击连接你的MetaMask钱包",
    },
  },
  defaultLocale: navigator.language,
});

export class MetamaskWallet implements Wallet {
  // name: string = "MetaMask";
  // description: string = "Connect to you MetaMask wallet.";

  private provider?: Provider;

  async connect(): Promise<Provider> {
    await this.isValid();

    if (this.provider) {
      return this.provider;
    }

    throw new Error("MetaMask wallet not found.");
  }

  get name(): string {
    return __("name");
  }

  get description(): string {
    return __("description");
  }

  async isValid(): Promise<boolean> {
    if (this.provider) {
      return true;
    }

    this.provider = (await detectEthereumProvider()) as Provider;

    if (this.provider) {
      return true;
    } else {
      return false;
    }
  }
}
