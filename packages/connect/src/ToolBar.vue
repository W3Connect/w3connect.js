<template>
	<div id="w3c-toolbar">
		<div id="w3c-toolbar-logo" :class="logo"></div>

		<div id="w3c-toolbar-title">{{ network.name.toUpperCase() }}</div>

		<div id="w3c-toolbar-more-button" @click="more" v-if="valid">
			<div :id="moreButtonId"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useWeb3Connect } from '@w3connect.js/core';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'Web3ConnectToolBar',
	setup() {
		const connect = useWeb3Connect();

		const network = connect.network;

		const logo = computed(() => {
			return `w3c-toolbar-${network.value.name}-logo`;
		});

		const router = useRouter();

		const moreButtonId = computed(() => {
			if (router.currentRoute.value.path == '/w3connect') {
				return 'w3c-toolbar-more-button-icon';
			} else {
				return 'w3c-toolbar-home-button-icon';
			}
		});

		const more = () => {
			if (router.currentRoute.value.path == '/w3connect') {
				router.push('/w3connect/more');
			} else {
				router.push('/w3connect');
			}
		};

		const valid = computed(() => {
			console.log('calc valid', connect.state.value);
			return connect.state.value != 'connecting';
		});

		return {
			network,
			logo,
			more,
			moreButtonId,
			valid,
		};
	},
});
</script>
