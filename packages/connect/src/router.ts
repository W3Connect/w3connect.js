import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './Home.vue';
import More from './More.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		default: true,
		// children: mainRouters,
	},
	{
		path: '/more',
		name: 'More',
		component: More,
		default: true,
		// children: mainRouters,
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
