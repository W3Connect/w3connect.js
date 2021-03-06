import { ethers } from 'ethers';
import {
	readonly,
	ref,
	UnwrapNestedRefs,
	Ref,
	DeepReadonly,
	isProxy,
	toRaw,
} from '@vue/reactivity';

import { Wallet, Provider } from '@w3connect.js/wallet';
import { Chain, fromURL } from '@w3connect.js/chainlist';

export type State = 'prepare' | 'connecting' | 'result' | 'closed';

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
	readonly chains: Array<Chain>;

	/**
	 * Connect State
	 */
	readonly state: DeepReadonly<UnwrapNestedRefs<Ref<State>>>;

	/**
	 * The default network
	 */
	readonly chain: DeepReadonly<UnwrapNestedRefs<Ref<Chain>>>;

	/**
	 * Currenct connecting wallet
	 */
	readonly wallet: DeepReadonly<UnwrapNestedRefs<Ref<Wallet | undefined>>>;

	/**
	 * The last error readonly reactivity object
	 */
	readonly lastError: DeepReadonly<UnwrapNestedRefs<Ref<Error | undefined>>>;

	/**
	 * Change default network
	 */
	changeNetwork(chain: Chain): Promise<void>;

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

	chains: Chain[];

	private _lastError: Ref<Error | undefined> = ref();

	private _currentWallet: Ref<Wallet | undefined> = ref();

	private resolve?: (value: Provider | PromiseLike<Provider>) => void;

	private reject?: (reason?: any) => void;

	private locales: any;

	private _chain: Ref<Chain>;

	private _state: Ref<State> = ref('closed');

	constructor(wallets: Wallet[], locales: any, chains: Chain[]) {
		this.wallets = wallets;
		this.chains = chains;
		this.locales = locales;
		this._chain = ref(chains[0]);

		const chainId = window.localStorage.getItem('chainId');

		if (chainId) {
			const chain = chains.find(chain => {
				return chain.chainId == parseInt(chainId);
			});

			if (chain) {
				this._chain.value = chain;
			}
		}
	}

	get wallet(): DeepReadonly<UnwrapNestedRefs<Ref<Wallet | undefined>>> {
		return readonly(this._currentWallet);
	}

	get lastError(): DeepReadonly<UnwrapNestedRefs<Ref<Error | undefined>>> {
		return readonly(this._lastError);
	}

	/**
	 * The default network
	 */
	get chain(): DeepReadonly<UnwrapNestedRefs<Ref<Chain>>> {
		return readonly(this._chain);
	}

	get state(): DeepReadonly<UnwrapNestedRefs<Ref<State>>> {
		return readonly(this._state);
	}
	/**
	 * Change default network
	 */
	async changeNetwork(chain: Chain): Promise<void> {
		this._chain.value = chain;
		window.localStorage.setItem('chainId', `${chain.chainId}`);
	}

	async connectTo(chainId?: number): Promise<Provider> {
		this._currentWallet.value = undefined;
		this._state.value = 'prepare';

		console.log('state changed:', this._state.value);

		if (chainId) {
			const network = this.chains.find(network => {
				return network.chainId == chainId;
			});

			if (network) {
				this._chain.value = network;
			} else {
				throw new Error(`Invalid chainId ${chainId}`);
			}
		}

		return new Promise<Provider>((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}

	async connectToWallet(wallet: Wallet): Promise<void> {
		if (isProxy(wallet)) {
			wallet = toRaw(wallet);
		}

		try {
			this._lastError.value = undefined;

			this._currentWallet.value = wallet;

			this._state.value = 'connecting';

			const provider = await wallet.connectTo(this._chain.value.chainId);

			if (this.resolve && this._state.value == 'connecting') {
				this.resolve(provider);
			}

			this._state.value = 'closed';
		} catch (error) {
			this._lastError.value = error as Error;
			this._state.value = 'result';
		}
	}

	async disconnect(): Promise<void> {
		await this._currentWallet.value?.disconnect();
	}

	async cancelConnectTo(reason: Error): Promise<void> {
		if (this.reject) {
			this.reject(reason);
		} else {
			this._lastError.value = reason;
		}

		this._state.value = 'closed';
	}

	async connectable(wallet: Wallet): Promise<boolean> {
		if (isProxy(wallet)) {
			wallet = toRaw(wallet);
		}

		return await wallet.connectable(this._chain.value.chainId);
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

export async function setup(
	wallets: Wallet[],
	locales: any,
	chains?: Chain[],
): Promise<Web3Connect> {
	if (!chains) {
		chains = await fromURL();
	}

	instance = new Web3ConnectImpl(wallets, locales, chains);

	return instance;
}

export function useWeb3Connect(): Web3Connect {
	if (!instance) {
		throw new Error('call makeConnect first');
	}
	return instance!;
}
