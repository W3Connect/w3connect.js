import { Provider, Wallet } from '@w3connect.js/wallet';
import { Ref } from 'vue';

export interface Web3Connect {
	connect(): Promise<Provider>;
}

export interface Web3VueConnect extends Web3Connect {
	readonly wallets: Ref<Array<Wallet>>;
	readonly showing: Ref<boolean>;
	connectTo(wallet: Wallet): Promise<void>;
}

let globalConnect: Web3Connect | undefined;

export function provide(connect: Web3Connect) {
	globalConnect = connect;
}

/**
 * Get register Web3Connect object
 * @returns The ``Web3Connect`` object
 */
export function useWeb3Connect(): Web3Connect {
	if (!globalConnect) {
		throw new Error('call makeConnect first');
	}
	return globalConnect!;
}
