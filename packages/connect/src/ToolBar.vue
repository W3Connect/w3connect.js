<template>
	<div id="w3c-toolbar">
		<div id="w3c-toolbar-logo" :class="logo"></div>

		<div id="w3c-toolbar-title">{{ network.name.toUpperCase() }}</div>

		<div id="w3c-toolbar-more-button" @click="more">
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
			if (router.currentRoute.value.path == '/') {
				return 'w3c-toolbar-more-button-icon';
			} else {
				return 'w3c-toolbar-home-button-icon';
			}
		});

		const more = async () => {
			if (router.currentRoute.value.path == '/more') {
				await router.push('/');
			} else {
				await router.push('/more');
			}
		};

		return {
			network,
			logo,
			more,
			moreButtonId,
		};
	},
});
</script>
