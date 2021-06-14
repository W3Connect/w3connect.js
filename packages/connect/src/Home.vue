<template>
	<div id="w3c-dialog-home">
		<div
			v-for="wallet in wallets"
			:key="wallet.name"
			class="w3c-menu"
			@click="clickMenu(wallet)"
		>
			<div class="w3c-menu-icon" :class="icon(wallet)"></div>
			<a class="w3c-menu-title">{{ name(wallet) }}</a>
			<a class="w3c-menu-description">
				{{ description(wallet) }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watchEffect } from 'vue';
import { useWeb3Connect } from '@w3connect.js/core';
import { Wallet } from '@w3connect.js/wallet';

export default defineComponent({
	name: 'Web3ConnectHome',
	setup() {
		const connect = useWeb3Connect();

		const wallets = ref(connect.wallets);

		watchEffect(async () => {
			if (connect.connecting.value) {
				const selected = connect.wallets.filter(async wallet => {
					return await connect.connectable(wallet);
				});

				wallets.value = selected;

				console.log(wallets.value);
			}
		});

		const icon = (wallet: Wallet) => {
			return `w3c-menu-${wallet.name.toLowerCase()}-icon`;
		};

		const name = (wallet: Wallet) => {
			return connect.localeString(wallet.name);
		};

		const description = (wallet: Wallet) => {
			return connect.localeString(`${wallet.name}-description`);
		};

		const valid = async (wallet: Wallet) => {
			return await connect.connectable(wallet);
		};

		const clickMenu = async (wallet: Wallet) => {
			try {
				await connect.connectToWallet(wallet);
			} catch (error) {
				console.error(
					'The implement must ensure connectTo never throw error',
				);
			}
		};

		return {
			name,
			description,
			icon,
			wallets,
			clickMenu,
			valid,
		};
	},
});
</script>
