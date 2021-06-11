import { Wallet, Provider } from '@w3connect.js/wallet';
import { createApp, Ref, ref } from 'vue';
import { Web3VueConnect, Web3Connect, provide } from './connect';
import App from './App.vue';

class Web3ConnectImpl implements Web3VueConnect {
	private _wallets: Ref<Array<Wallet>>;
	private containerOrSelector: Element | string;
	private mounted: boolean = false;

	private _showing: Ref<boolean>;

	private resolve?: (value: Provider | PromiseLike<Provider>) => void;

	private reject?: (reason?: any) => void;

	constructor(
		containerOrSelector: Element | string,
		...wallets: Array<Wallet>
	) {
		this._wallets = ref(wallets);
		this.containerOrSelector = containerOrSelector;
		this._showing = ref(false);
	}

	/**
	 * Show web3 provider facade ui
	 */
	async connect(): Promise<Provider> {
		if (!this.mounted) {
			createApp(App).mount(this.containerOrSelector);
			this.mounted = true;
		}

		this._showing.value = true;

		return new Promise<Provider>((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		});
	}

	async connectTo(wallet: Wallet): Promise<void> {
		try {
			const provider = await wallet.connect();
			if (this.resolve) {
				this.resolve(provider);
			}
		} catch (error) {
			if (this.reject) {
				this.reject(error);
			}
		}
	}

	async cancel(): Promise<void> {
		if (this.reject) {
			this.reject(new Error('User cancel'));
		}
	}

	public get showing() {
		return this._showing;
	}

	public get wallets() {
		return this._wallets;
	}
}

export function makeConnect(
	containerOrSelector: Element | string,
	...wallets: Array<Wallet>
): Web3Connect {
	const connect = new Web3ConnectImpl(containerOrSelector, ...wallets);

	provide(connect);

	return connect;
}
