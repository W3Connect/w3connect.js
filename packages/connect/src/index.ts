import './assets/theme.css';

import { setup as _setup, Web3Connect } from '@w3connect.js/core';
import { Chain } from '@w3connect.js/chainlist';
import { Wallet } from '@w3connect.js/wallet';
import App from './App.vue';
import { createApp } from 'vue';

export const defaultLocales = {
	en: {
		fortmatic: 'Fortmatic',
		'fortmatic-description': 'Login in fortmatic to using wallet',
		metamask: 'MetaMask',
		'metamask-description': 'Connect to Metamask wallet',
		retry: 'RETRY',
	},
	'zh-CN': {
		fortmatic: 'Fortmatic',
		'fortmatic-description': '登录 "Fortmatic" 账号，使用钱包',
		metamask: 'MetaMask',
		'metamask-description': '点击连接 "Metamask" 钱包',
		retry: '重试',
	},
};

function isObject(item: any) {
	return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target: any, ...sources: any): any {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}

export async function setup(
	containerOrSelector: Element | string,
	wallets: Wallet[],
	locales: any = {},
	chains?: Chain[],
): Promise<Web3Connect> {
	const connect = await _setup(
		wallets,
		mergeDeep(locales, defaultLocales),
		chains,
	);

	createApp(App).mount(containerOrSelector);

	return connect;
}
