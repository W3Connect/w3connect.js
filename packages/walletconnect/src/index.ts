import "./assets/style.css";

import { Provider, Wallet } from "@w3connect.js/wallet";

export class WalletConnectWallet implements Wallet {
  // name: string = "MetaMask";
  // description: string = "Connect to you MetaMask wallet.";

  constructor() {}

  async connectable(chainId: number): Promise<boolean> {
    return true;
  }

  isValid?: (() => Promise<boolean>) | undefined;

  async disconnect(): Promise<void> {}

  async connectTo(chainId: number): Promise<Provider> {
    return {} as Provider;
  }

  get name(): string {
    return "WalletConnect";
  }
}
