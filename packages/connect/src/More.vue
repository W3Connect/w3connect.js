<template>
	<div id="w3c-networks">
		<input id="w3c-networks-searchbar" v-model="searchText" />
		<!-- <virtual-list :data="chains" :itemSize="60">
			<template v-slot="{ item, index }"> -->

		<div
			v-for="item in chains"
			:key="item.chainId"
			class="w3c-network-item"
			:class="selected(item)"
			@click="select(item)"
		>
			<!-- <div
				class="w3c-network-item"
				:class="selected(item)"
				@click="select(item)"
			> -->
			<img class="w3c-network-item-icon" v-if="item.icon" />
			<div
				class="w3c-network-item-icon w3c-chain-icon-default"
				v-else
			></div>
			<div>{{ item.name.toUpperCase() }}({{ item.chainId }})</div>
			<!-- </div> -->
		</div>
		<!-- </template>
		</virtual-list> -->
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref, watchEffect } from 'vue';
import { useWeb3Connect, Network } from '@w3connect.js/core';
import { Chain } from '@w3connect.js/chainlist';
import { VirtualList } from 'vue3-virtual-list';

export default defineComponent({
	name: 'Web3ConnectMore',
	components: {
		'virtual-list': VirtualList,
	},
	setup() {
		const connect = useWeb3Connect();

		// const chains = connect.chains;

		const chain = connect.chain;

		const logo = (chain: Chain) => {
			return `w3c-toolbar-${chain.shortName}-logo`;
		};

		const contentIs = inject('contentIs') as Ref<string>;

		const select = async (chain: Chain) => {
			await connect.changeNetwork(chain);
			contentIs.value = 'home';
		};

		const selected = (target: Network) => {
			if (chain.value.chainId == target.chainId) {
				return 'w3c-network-item-selected';
			} else {
				return '';
			}
		};

		const searchText = ref('');

		const chains: Ref<Chain[]> = ref(connect.chains);

		watchEffect(() => {
			if (searchText.value == '') {
				console.log(connect.chains.length);
				chains.value = connect.chains;
				return;
			}

			const result = connect.chains.filter(it => {
				if (
					it.shortName
						.toLowerCase()
						.indexOf(searchText.value.toLowerCase()) != -1
				) {
					return true;
				}

				if (
					`${it.chainId}`.indexOf(searchText.value.toLowerCase()) !=
					-1
				) {
					return true;
				}

				return false;
			});

			chains.value = result;
		});

		return {
			logo,
			chains,
			selected,
			select,
			searchText,
		};
	},
});
</script>
