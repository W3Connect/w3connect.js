import fetch from 'cross-fetch';
import { ethers } from 'ethers';

/**
 * ChainList data
 */
export interface Chain {
	name: string;
	chainId: number;
	shortName: string;
	nativeCurrency: { name: string; symbol: string; decimals: number };
	rpc: string[];
	faucets?: string[];
	explorers: { name: string; url: string; standard: string }[];
	infoURL?: string;
	ensAddress?: string;
	icon?: string;
}

/**
 * Convert Chain object to EIP2015 method params
 * @param chain
 * @returns
 */
export function toEIP2015(chain: Chain): any {
	return {
		chainId: chain.chainId,
		chainName: chain.name,
		rpcUrl: chain.rpc[0],
		nativeCurrency: chain.nativeCurrency,
		blockExplorerUrl: chain.infoURL,
	};
}

/**
 * Get chainlist from url
 * @param url chainlist url
 * @returns chainlist object
 */
export async function fromURL(
	url: string = 'https://chainid.network/chains.json',
): Promise<Chain[]> {
	const response = await fetch(url);

	if (response.status >= 400) {
		throw new Error('Bad response from server');
	}

	return await response.json();
}

export async function ensLookup(
	provider: ethers.providers.EnsProvider,
	name: string,
): Promise<Chain[] | undefined> {
	const resolver = await provider.getResolver(name);

	// const resolver.getContentHash()

	return undefined;
}
