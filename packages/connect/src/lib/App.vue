<template>
	<teleport to="body">
		<transition name="w3c-modal">
			<div id="w3c-modal" @click.self="click" v-if="modal">
				<transition name="w3c-dialog">
					<div id="w3c-dialog" class="w3c-water-fall" v-if="dialog">
						<div
							v-for="wallet in wallets"
							:key="wallet.name"
							class="w3c-water-fall-item"
						>
							<div class="w3c-menu" @click="clickMenu(wallet)">
								<div
									class="w3c-menu-icon"
									:class="icon(wallet)"
								></div>
								<a class="w3c-menu-title">{{ wallet.name }}</a>
								<a class="w3c-menu-description">
									{{ wallet.description }}
								</a>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</transition>
	</teleport>
</template>

<script lang="ts">
import {
	defineComponent,
	ref,
	WritableComputedRef,
	computed,
	Ref,
	nextTick,
} from 'vue';
import { useWeb3Connect, Web3VueConnect } from './connect';
import { Wallet } from '@w3connect.js/wallet';

function useDelayShowing(connect: Web3VueConnect): {
	modal: WritableComputedRef<boolean>;
	dialog: Ref<boolean>;
} {
	const dialog = ref(false);
	const modal = computed({
		get: () => {
			if (connect.showing.value) {
				nextTick(() => {
					dialog.value = true;
				});
			}
			return connect.showing.value;
		},
		set: value => {
			if (!value) {
				dialog.value = false;
				nextTick(() => {
					connect.showing.value = false;
				});
			}
		},
	});

	return {
		modal,
		dialog,
	};
}

export default defineComponent({
	name: 'W3Connect',
	setup() {
		const connect = useWeb3Connect() as Web3VueConnect;

		const { modal, dialog } = useDelayShowing(connect);

		const wallets = connect.wallets;

		const click = async () => {
			await connect.cancel();
			modal.value = false;
		};

		const clickMenu = async (wallet: Wallet) => {
			try {
				modal.value = false;
				await connect.connectTo(wallet);
			} catch (error) {
				console.error(
					'The implement must ensure connectTo never throw error',
				);
			}
		};

		const icon = (wallet: Wallet) => {
			return `w3c-menu-${wallet.name.toLowerCase()}-icon`;
		};

		return {
			click,
			modal,
			wallets,
			dialog,
			icon,
			clickMenu,
		};
	},
});
</script>
