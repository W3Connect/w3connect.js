<template>
	<div id="w3c-result">
		<div class="w3c-menu-icon" :class="icon()"></div>
		<a class="w3c-menu-title">{{ name() }}</a>
		<div id="w3-result-info">
			<div class="w3c-provider-error" v-if="showingError">
				{{ lastError() }}
			</div>

			<div class="w3c-loader" v-else>test</div>
		</div>

		<div id="w3c-retry" @click="clickMenu" v-show="showingError">
			{{ connect.localeString('retry') }}
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { useWeb3Connect, Network } from '@w3connect.js/core';
import { Wallet } from '@w3connect.js/wallet';

export default defineComponent({
	name: 'Web3ConnectResult',
	setup() {
		const connect = useWeb3Connect();

		const wallet = connect.wallet;

		const lastError = () => {
			return connect.lastError.value?.message;
		};

		const showingError = computed(() => {
			return connect.lastError.value != undefined;
		});

		const icon = () => {
			return `w3c-menu-${wallet.value?.name.toLowerCase()}-icon`;
		};

		const name = () => {
			return connect.localeString(wallet.value?.name ?? '');
		};

		const description = (wallet: Wallet) => {
			return connect.localeString(`${wallet.name}-description`);
		};

		const clickMenu = async () => {
			try {
				await connect.connectToWallet(wallet.value!);
			} catch (error) {
				console.error(
					'The implement must ensure connectTo never throw error',
				);
			}
		};

		return {
			icon,
			name,
			description,
			wallet,
			lastError,
			showingError,
			clickMenu,
			connect,
		};
	},
});
</script>
