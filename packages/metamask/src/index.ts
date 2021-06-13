import "./assets/style.css";

import { Provider, Wallet } from "@w3connect.js/wallet";
import detectEthereumProvider from "@metamask/detect-provider";

export class MetamaskWallet implements Wallet {
  // name: string = "MetaMask";
  // description: string = "Connect to you MetaMask wallet.";

  private provider?: Provider;

  async connectTo(chainId: number = 1): Promise<Provider> {
    await this.isValid();

    if (this.provider) {
      await this.provider.request({ method: "eth_requestAccounts" });
      return this.provider;
    }

    throw new Error("MetaMask wallet not found.");
  }

  get name(): string {
    return "MetaMask";
  }

  async connectable(chainId: number): Promise<boolean> {
    return true;
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

  async disconnect(): Promise<void> {}
}
