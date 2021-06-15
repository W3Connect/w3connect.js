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
import { defineComponent, inject, Ref } from 'vue';
import { useWeb3Connect, Network } from '@w3connect.js/core';

export default defineComponent({
	name: 'Web3ConnectMore',
	setup() {
		const connect = useWeb3Connect();

		const networks = connect.networks;

		const network = connect.network;

		const logo = (network: Network) => {
			return `w3c-toolbar-${network.name}-logo`;
		};

		const contentIs = inject('contentIs') as Ref<string>;

		const select = async (network: Network) => {
			await connect.changeNetwork(network);
			contentIs.value = 'home';
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
