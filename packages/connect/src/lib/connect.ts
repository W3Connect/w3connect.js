import { Provider, Wallet } from '@w3connect.js/wallet';
import { Ref } from 'vue';

export interface Web3Connect {
	connect(chainId?: number): Promise<Provider>;
	disconnect(): Promise<void>;
}

export interface Web3VueConnect extends Web3Connect {
	readonly wallets: Array<Wallet>;
	readonly showing: Ref<boolean>;
	connectTo(wallet: Wallet): Promise<void>;
	cancel(): Promise<void>;
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
