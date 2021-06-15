<template>
	<teleport to="body">
		<transition name="w3c-dialog-stage">
			<div
				id="w3c-dialog-stage"
				v-if="showingStage"
				@click.self="dismiss"
			>
				<transition name="w3c-dialog">
					<div id="w3c-dialog" v-if="showingDialog">
						<tool-bar></tool-bar>
						<transition name="w3c-router" mode="out-in">
							<component :is="contentIs" />
						</transition>
						<a
							id="w3-footer-bar"
							href="https://github.com/W3Connect/w3connect.js"
						>
							This page powered by @web3connect.js
						</a>
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, nextTick, provide } from 'vue';
import { useWeb3Connect } from '@w3connect.js/core';
import ToolBar from './ToolBar.vue';
import Home from './Home.vue';
import More from './More.vue';
import Result from './Result.vue';

export default defineComponent({
	name: 'W3ConnectDialog',
	components: {
		ToolBar,
		Home,
		More,
		Result,
	},
	setup() {
		const connect = useWeb3Connect();

		const showingStage = ref(false);

		const showingDialog = ref(false);

		const contentIs = ref('home');

		provide('contentIs', contentIs);

		watchEffect(() => {
			switch (connect.state.value) {
				case 'prepare': {
					if (!showingStage.value) {
						showingStage.value = true;

						nextTick(() => {
							showingDialog.value = true;
							contentIs.value = 'home';
						});
					}

					break;
				}
				case 'connecting': {
					contentIs.value = 'result';
					break;
				}
				case 'closed': {
					{
						showingDialog.value = false;

						nextTick(() => {
							showingStage.value = false;
						});
					}
				}
			}
		});

		const dismiss = async () => {
			connect.cancelConnectTo(new Error('User cancel'));
		};

		return {
			showingStage,
			showingDialog,
			dismiss,
			contentIs,
		};
	},
});
</script>
