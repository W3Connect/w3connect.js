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
	key: string;
	name?: string;
	rpcUrl?: string;
	chainId: number;
}

function option(
	node: Node,
): string | { rpcUrl: String; chainId?: number } | undefined {
	if (node.rpcUrl) {
		return { rpcUrl: node.rpcUrl, chainId: node.chainId };
	} else {
		return node.name;
	}
}

const defaultNodes = [
	{
		key: 'pk_live_9381E04748181462',
		chainId: 1,
	},
	{
		key: 'pk_live_9381E04748181462',
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
	private nodes: Node[];

	private wrappedProvider: WrappedProvider;

	constructor(nodes: Array<Node> = defaultNodes) {
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

		const provider = new (Fortmatic as any)(
			node.key,
			option(node),
		).getProvider();

		const accounts = await provider.enable();

		const account = accounts.length > 0 ? accounts[0] : '';

		this.wrappedProvider.connect(provider, chainId, account);

		return this.wrappedProvider;
	}

	async disconnect(): Promise<void> {}

	async supportChain(chainId: number): Promise<boolean> {
		const node = this.nodes.find(item => {
			return item.chainId == chainId;
		});

		return node != undefined;
	}

	get name(): string {
		return __('fortmatic-name');
	}

	get description(): string {
		return __('fortmatic-description');
	}
}
