import { App, router } from './lib';
import { createApp, provide, inject } from 'vue';

export interface Wallet {
	readonly name: string;
	call(): string;
}

/**
 * The request arguments interface
 */
export interface RequestArguments {
	readonly method: string;
	readonly params?: readonly any[] | object;
}

export type EventType = string | symbol;

export type Listener = (...args: Array<any>) => void;

/**
 * EIP1193 compatible provider interface
 */
export interface Provider {
	request(args: RequestArguments): Promise<any>;
	on(eventName: EventType, listener: Listener): this;
	removeListener(eventName: EventType, listener: Listener): this;
}

export class Web3Connect {
	private wallets: Array<Wallet>;
	private containerOrSelector: Element | string;

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
		createApp(App).use(router).mount(this.containerOrSelector);
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
