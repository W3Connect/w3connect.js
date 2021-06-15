import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs'],
			fileName: 'index',
		},
		rollupOptions: {},
	},
});
