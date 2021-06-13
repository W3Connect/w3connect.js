import { ethers } from 'ethers';
import {
	readonly,
	ref,
	UnwrapNestedRefs,
	Ref,
	DeepReadonly,
} from '@vue/reactivity';

import { Wallet, Provider } from '@w3connect.js/wallet';
import { type } from 'os';

/**
 * The w3connect support chain network object
 */
export type Network = ethers.providers.Network;

/**
 * The Web3Connect.js core interface, provider the main functions
 */
export interface Web3Connect {
	/**
	 * Connect to web3 network with chainId
	 * @param chainId the web3 network chainId
	 */
	connectTo(chainId?: number): Promise<Provider>;

	/**
	 * Disconnect from web3 network
	 */
	disconnect(): Promise<void>;

	/**
	 * Support wallet list
	 */
	readonly wallets: Array<Wallet>;

	/**
	 * Support web3 networks
	 */
	readonly networks: Array<Network>;

	/**
	 * Connecting status reactive attribute
	 */
	readonly connecting: DeepReadonly<UnwrapNestedRefs<Ref<boolean>>>;

	/**
	 * cancel connectTo procedure with Error
	 */
	cancelConnectTo(reason: Error): Promise<void>;

	/**
	 * Process really connecting procedure
	 * @param wallet connect to wallet object
	 */
	connectToWallet(wallet: Wallet): Promise<void>;

	/**
	 * Get i18n local string by key
	 * @param key The i18n string key
	 */
	localeString(key: string): string;

	/**
	 * Check if this wallet connectable
	 * @param wallet
	 */
	connectable(wallet: Wallet): Promise<boolean>;
}

class Web3ConnectImpl implements Web3Connect {
	wallets: Wallet[];

	networks: Network[];

	private _connecting = ref(false);

	private resolve?: (value: Provider | PromiseLike<Provider>) => void;

	private reject?: (reason?: any) => void;

	private currentWallet?: Wallet;

	private chainId?: number;

	private locales: any;

	constructor(wallets: Wallet[], networks: Network[], locales: any) {
		this.wallets = wallets;
		this.networks = networks;
		this.locales = locales;
	}

	async connectTo(chainId: number = 1): Promise<Provider> {
		this.chainId = chainId;

		this._connecting.value = true;

		return new Promise<Provider>((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}

	async connectToWallet(wallet: Wallet): Promise<void> {
		this._connecting.value = false;

		try {
			const provider = await wallet.connectTo(this.chainId);
			this.currentWallet = wallet;
			if (this.resolve) {
				this.resolve(provider);
			}
		} catch (error) {
			if (this.reject) {
				this.reject(error);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.currentWallet?.disconnect();
	}

	get connecting(): DeepReadonly<UnwrapNestedRefs<Ref<boolean>>> {
		return readonly(this._connecting);
	}

	async cancelConnectTo(reason: Error): Promise<void> {
		if (this.reject) {
			this.reject(reason);
		} else {
			console.error(reason);
		}

		this._connecting.value = false;
	}

	async connectable(wallet: Wallet): Promise<boolean> {
		return await wallet.connectable(this.chainId ?? 1);
	}

	localeString(key: string): string {
		const lowercase = key.toLowerCase();
		for (let language of navigator.languages) {
			for (let name in this.locales) {
				if (name.toLowerCase() == language.toLowerCase()) {
					const localstring = this.locales[name][lowercase];

					if (localstring) {
						return localstring;
					}
				}
			}
		}

		if (this.locales['en']) {
			const localstring = this.locales['en'][lowercase];

			if (localstring) {
				return localstring;
			}
		}

		return key;
	}
}

let instance: Web3Connect | undefined;

export function setup(
	wallets: Wallet[],
	networks: Network[],
	locales: any,
): Web3Connect {
	instance = new Web3ConnectImpl(wallets, networks, locales);

	return instance;
}

export function useWeb3Connect(): Web3Connect {
	if (!instance) {
		throw new Error('call makeConnect first');
	}
	return instance!;
}
