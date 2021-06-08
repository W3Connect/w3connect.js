import { App, router } from './lib';
import { createApp, provide, inject } from 'vue';
import { Wallet } from '@web3connect.js/wallet';

export class Web3Connect {
	private wallets: Array<Wallet>;
	private containerOrSelector: Element | string;
	private mounted: boolean = false;

	constructor(
		containerOrSelector: Element | string,
		...wallets: Array<Wallet>
	) {
		this.wallets = wallets;
		this.containerOrSelector = containerOrSelector;
	}

	/**
	 * Show web3 provider facade ui
	 */
	async connect() {
		if (!this.mounted) {
			createApp(App).use(router).mount(this.containerOrSelector);
			this.mounted = true;
		}
	}
}

export const appSymbol = Symbol();

/**
 * Get register Web3Connect object
 * @returns The ``Web3Connect`` object
 */
export function useWeb3Connect(): Web3Connect {
	const connect = inject(appSymbol);
	if (!connect) {
		throw new Error('provide app first');
	}
	return connect as Web3Connect;
}

export function provideWeb3Connect(
	containerOrSelector: Element | string,
	...wallets: Array<Wallet>
): Web3Connect {
	const connect = new Web3Connect(containerOrSelector, ...wallets);
	provide(appSymbol, connect);

	return connect;
}
