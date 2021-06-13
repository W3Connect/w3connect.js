<template>
	<div id="sample">
		<div id="header">
			<div id="address" v-if="connected">
				Connect to <a>'{{ network }}' </a> with address
				<a>'{{ address }}'</a>
			</div>
		</div>

		<div id="content">
			<div id="title">Test Web3Connect.js</div>
			<div class="loader" v-if="disabled"></div>
			<button id="show-button" @click="click" v-else>
				{{ buttonText }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Wallet } from '@w3connect.js/wallet';
import { computed, defineComponent, ref } from 'vue';
import { setup } from '../';
import { MetamaskWallet } from '@w3connect.js/metamask';
import { FortmaticWallet } from '@w3connect.js/fortmatic';
import { ethers } from 'ethers';

function sampleWallet(): Wallet[] {
	return [new MetamaskWallet(), new FortmaticWallet()];
}

export default defineComponent({
	name: 'App',
	setup() {
		const connect = setup('#w3c', sampleWallet());

		const disabled = ref(false);

		const address = ref('');

		const network = ref('');

		const connected = computed(() => {
			return address.value != '';
		});

		const buttonText = computed(() => {
			if (connected.value) {
				return 'Disconnect';
			} else {
				return 'Connect';
			}
		});

		const click = async () => {
			if (connected.value) {
				address.value = '';
				connect.disconnect();
				return;
			}

			disabled.value = true;
			try {
				const provider = await connect.connectTo();

				const client = new ethers.providers.Web3Provider(provider);

				address.value = (await client.listAccounts())[0];

				const detectedNetwork = await client.detectNetwork();

				network.value = `${detectedNetwork.name}(${detectedNetwork.chainId})`;
			} catch (error) {
				console.info(error);
			}

			disabled.value = false;
		};

		const isLoading = computed(() => {
			if (disabled.value) {
				return 'loader';
			} else {
				return '';
			}
		});

		return {
			isLoading,
			click,
			disabled,
			address,
			buttonText,
			connected,
			network,
		};
	},
});
</script>

<style>
#sample {
	margin: 10px;
	display: flex;
	flex-wrap: nowrap;
	flex-direction: column;
	align-items: center;
	height: 100%;
	justify-content: center;
}

#show-button {
	transition: all 0.15s ease-in-out 0s;
	position: relative;
	background-image: none;
	outline: none;
	overflow: hidden;
	box-sizing: border-box;
	background-color: rgb(64, 153, 255);
	border: none;
	color: rgb(255, 255, 255);
	box-shadow: rgb(50 50 93 / 11%) 0px 4px 6px 0px,
		rgb(0 0 0 / 8%) 0px 1px 3px 0px, rgb(0 0 0 / 6%) 0px 0px 1px 0px inset;
	border-radius: 32px;
	font-size: 16px;
	font-weight: 600;
	height: 48px;
	width: 200px;
	padding: 8px 12px;
	cursor: pointer;
	text-align: center;
	line-height: 30px;
	user-select: none;
}

#show-button[disabled] {
	background-color: rgba(64, 153, 255, 0.521);
	pointer-events: none;
}

#header {
	height: 40px;
}

#title {
	margin: 40px;
	height: fit-content;
	font-weight: bolder;
	font-size: 40px;
}

#address {
	margin-top: 20px;
	height: fit-content;
	font-weight: lighter;
	font-size: 12px;
}

#address > a {
	font-weight: bolder;
	font-size: 16px;
}

@media (max-width: 40em) {
	#address {
		font-size: 1vw;
	}

	#address > a {
		font-size: 2vw;
	}

	#title {
		font-size: 6vw;
	}
}

#content {
	margin: auto;
	display: flex;
	flex-wrap: nowrap;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100vh;
}

html,
body {
	margin: 0;
	height: 100%;
	overflow: hidden;
}

.loader,
.loader:after {
	border-radius: 50%;
	width: 20px;
	height: 20px;
}
.loader {
	margin: auto;
	font-size: 10px;
	position: relative;
	text-indent: -9999em;
	border-top: 4px solid rgba(110, 108, 108, 0.2);
	border-right: 4px solid rgba(110, 108, 108, 0.2);
	border-bottom: 4px solid rgba(110, 108, 108, 0.2);
	border-left: 4px solid rgb(64, 153, 255);
	-webkit-transform: translateZ(0);
	-ms-transform: translateZ(0);
	transform: translateZ(0);
	-webkit-animation: load8 1.1s infinite linear;
	animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
</style>
