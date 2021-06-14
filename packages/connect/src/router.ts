import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './Home.vue';
import More from './More.vue';
import Result from './Result.vue';

const routes = [
	{
		path: '/w3connect',
		component: Home,
		default: true,
		// children: mainRouters,
	},
	{
		path: '/w3connect/more',
		component: More,
	},
	{
		path: '/w3connect/result',
		component: Result,
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
