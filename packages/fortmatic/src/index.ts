import './assets/style.css';

import {
	EventType,
	Listener,
	Provider,
	RequestArguments,
	Wallet,
} from '@w3connect.js/wallet';
import Fortmatic from 'fortmatic';

import { EventEmitter } from 'events';

import { __ } from 'i18n-for-browser';

export interface Node {
	rpcUrl: string;
	chainId: number;
}

const defaultNodes = [
	{
		rpcUrl: 'https://alpha.ethereum.matic.network',
		chainId: 1,
	},
	{
		rpcUrl: 'https://testnet2.matic.network',
		chainId: 3,
	},
];

interface FmProvider {
	send<ResultType>(method: string, params?: any[]): Promise<ResultType>;
}

class WrappedProvider extends EventEmitter implements Provider {
	private rawProvider?: FmProvider;

	private chainId?: number;

	private account?: string;

	async request(args: RequestArguments): Promise<any> {
		if (!this.rawProvider) {
			throw new Error('Fortmatic provider disconnected');
		}

		return await this.rawProvider.send<any>(
			args.method,
			args.params as any,
		);
	}

	connect(provider: FmProvider, chainId: number, account: string) {
		if (!this.rawProvider) {
			this.emit('connect', { chainId: `${chainId}` });
		} else {
			if (this.chainId != chainId) {
				this.emit('chainChanged', { chainId: `${chainId}` });
			}

			if (this.account != account) {
				this.emit('chainChanged', { accounts: [account] });
			}
		}

		this.account = account;

		this.chainId = chainId;

		this.rawProvider = provider;
	}

	disconnect() {
		this.rawProvider = undefined;
	}
}

export class FortmaticWallet implements Wallet {
	private key: string;

	private nodes: Node[];

	private wrappedProvider: WrappedProvider;

	constructor(key: string, nodes: Array<Node> = defaultNodes) {
		this.key = key;
		this.nodes = nodes;
		this.wrappedProvider = new WrappedProvider();
	}

	async connect(chainId: number = 1): Promise<Provider> {
		const node = this.nodes.find(item => {
			return item.chainId == chainId;
		});

		if (!node) {
			throw new Error(`Unsupport chain(${chainId})`);
		}

		const provider = new Fortmatic(this.key).getProvider();

		const accounts = await provider.enable();

		const account = accounts.length > 0 ? accounts[0] : '';

		this.wrappedProvider.connect(provider, chainId, account);

		return this.wrappedProvider;
	}

	async disconnect(): Promise<void> {}

	get name(): string {
		return __('fortmatic-name');
	}

	get description(): string {
		return __('fortmatic-description');
	}
}
