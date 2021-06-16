<template>
	<div id="w3c-toolbar">
		<img id="w3c-toolbar-logo" v-if="chain.icon" />
		<div id="w3c-toolbar-logo" class="w3c-chain-icon-default" v-else></div>

		<div id="w3c-toolbar-title">{{ chain.name.toUpperCase() }}</div>

		<div id="w3c-toolbar-more-button" @click="more" v-if="valid">
			<div :id="moreButtonId"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref } from 'vue';
import { useWeb3Connect } from '@w3connect.js/core';

export default defineComponent({
	name: 'Web3ConnectToolBar',
	setup() {
		const connect = useWeb3Connect();

		const chain = connect.chain;

		const contentIs = inject('contentIs') as Ref<string>;

		const logo = computed(() => {
			return `w3c-toolbar-${chain.value.shortName}-logo`;
		});

		const moreButtonId = computed(() => {
			if (contentIs.value == 'home') {
				return 'w3c-toolbar-more-button-icon';
			} else {
				return 'w3c-toolbar-home-button-icon';
			}
		});

		const more = () => {
			if (contentIs.value == 'home') {
				contentIs.value = 'more';
			} else {
				contentIs.value = 'home';
			}
		};

		const valid = computed(() => {
			console.log('calc valid', connect.state.value);
			return connect.state.value != 'connecting';
		});

		return {
			chain,
			logo,
			more,
			moreButtonId,
			valid,
		};
	},
});
</script>
