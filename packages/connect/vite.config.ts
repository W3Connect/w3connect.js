import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
// import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		emptyOutDir: true,
		minify: true,
		// assetsInlineLimit: 100000000,
		// chunkSizeWarningLimit: 100000000,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'blockinsight.js',
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['vue'],
		},
	},
});
