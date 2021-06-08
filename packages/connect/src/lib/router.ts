import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './screen/Home.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		default: true,
		// children: mainRouters,
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
