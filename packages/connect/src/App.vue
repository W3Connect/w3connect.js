<template>
	<teleport to="body">
		<router-view v-slot="{ Component }">
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
								<component :is="Component" />
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
		</router-view>
	</teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect, nextTick, onMounted } from 'vue';
import { useWeb3Connect } from '@w3connect.js/core';
import ToolBar from './ToolBar.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'W3ConnectDialog',
	components: {
		ToolBar,
	},
	setup() {
		const connect = useWeb3Connect();

		const showingStage = ref(false);

		const showingDialog = ref(false);

		const router = useRouter();

		onMounted(() => {
			router.push('/');
		});

		watchEffect(() => {
			if (connect.connecting.value) {
				showingStage.value = connect.connecting.value;

				nextTick(() => {
					showingDialog.value = connect.connecting.value;
				});
			} else {
				showingDialog.value = connect.connecting.value;

				nextTick(() => {
					showingStage.value = connect.connecting.value;
				});
			}
		});

		const dismiss = async () => {
			connect.cancelConnectTo(new Error('User cancel'));
		};

		return {
			showingStage,
			showingDialog,
			dismiss,
		};
	},
});
</script>
