<template>
	<teleport to="body">
		<router-view></router-view>
	</teleport>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

export default defineComponent({
	name: 'Sample',
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
