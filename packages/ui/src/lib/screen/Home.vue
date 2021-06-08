<template>
	<div class="web3-provider nav" @click="click">test {{ readersNumber }}</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
	name: 'Web3Provider',
	setup() {
		const click = async () => {
			console.log('test');
		};

		const readersNumber = ref(0);

		return {
			click,
			readersNumber,
		};
	},
});
</script>
