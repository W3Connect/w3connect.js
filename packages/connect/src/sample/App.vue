<template>
	<div id="show-button" @click="click">Test connect</div>
</template>

<script lang="ts">
import { Provider, Wallet } from '@w3connect.js/wallet';
import { defineComponent } from 'vue';
import { makeConnect } from '../';

function sampleWallet(): Wallet[] {
	return [
		{
			name: 'WalletConnect',
			description: 'Scan with WalletConnect to connect',
			connect: async () => {
				return {} as Provider;
			},
		},
		{
			name: 'Metamask',
			description: 'Connect to you MetaMask wallet',
			connect: async () => {
				return {} as Provider;
			},
		},
		{
			name: 'Torus',
			description: 'Connect to you Torus account',
			connect: async () => {
				return {} as Provider;
			},
		},
		{
			name: 'Fortmatic',
			description: 'Connect to you Fortmatic account',
			connect: async () => {
				return {} as Provider;
			},
		},
	];
}

export default defineComponent({
	name: 'App',
	setup() {
		const connect = makeConnect('#w3c', ...sampleWallet());

		const click = async () => {
			await connect.connect();
		};

		return {
			click,
		};
	},
});
</script>

<style>
#show-button {
	margin: 0 auto;
	transition: all 0.15s ease-in-out 0s;
	position: relative;
	background-image: none;
	outline: none;
	overflow: hidden;
	box-sizing: border-box;
	background-color: rgb(64, 153, 255);
	border: none;
	color: rgb(255, 255, 255);
	box-shadow: rgb(50 50 93 / 11%) 0px 4px 6px 0px,
		rgb(0 0 0 / 8%) 0px 1px 3px 0px, rgb(0 0 0 / 6%) 0px 0px 1px 0px inset;
	border-radius: 32px;
	font-size: 16px;
	font-weight: 600;
	height: 48px;
	width: 200px;
	margin: 0px auto;
	padding: 8px 12px;
	cursor: pointer;
	text-align: center;
	line-height: 30px;
	user-select: none;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	min-height: 100vh;
	display: flex;
	align-content: center;
	align-items: center;
}

html,
body {
	margin: 0;
	height: 100%;
	overflow: hidden;
}
</style>
