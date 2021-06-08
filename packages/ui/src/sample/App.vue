<template>
	<div id="show-button" @click="click">Test connect</div>
	<div id="web3connect"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { provideWeb3Connect } from '../';

export default defineComponent({
	name: 'App',
	setup() {
		const web3Connect = provideWeb3Connect('#w3c');

		const click = async () => {
			await web3Connect.connect();
		};

		return {
			click,
		};
	},
});
</script>

<style>
#show-button {
	margin: 0 auto;
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
	margin: 0px auto;
	padding: 8px 12px;
	cursor: pointer;
	text-align: center;
	line-height: 30px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	min-height: 100vh;
}
</style>
