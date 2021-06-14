<template>
	<div id="w3c-networks">
		<div
			v-for="network in networks"
			:key="network.chainId"
			class="w3c-network-item"
			:class="selected(network)"
			@click="select(network)"
		>
			<div class="w3c-network-item-icon" :class="logo(network)"></div>
			<div>{{ network.name.toUpperCase() }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import { nextTick, defineComponent } from 'vue';
import { useWeb3Connect, Network } from '@w3connect.js/core';
import { Wallet } from '@w3connect.js/wallet';
import { useRouter } from 'vue-router';
import { setTimeout } from 'timers';

export default defineComponent({
	name: 'Web3ConnectMore',
	setup() {
		const connect = useWeb3Connect();

		const networks = connect.networks;

		const network = connect.network;

		const router = useRouter();

		const logo = (network: Network) => {
			return `w3c-toolbar-${network.name}-logo`;
		};

		const select = async (network: Network) => {
			await connect.changeNetwork(network);
			router.push('/w3connect');
		};

		const selected = (target: Network) => {
			if (network.value.chainId == target.chainId) {
				return 'w3c-network-item-selected';
			} else {
				return '';
			}
		};

		return {
			logo,
			networks,
			selected,
			select,
		};
	},
});
</script>
