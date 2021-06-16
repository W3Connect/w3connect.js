// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import styles from 'rollup-plugin-styles';
import builtins from 'rollup-plugin-node-builtins';
export default [
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/index.cjs.js',
			format: 'cjs',
		},
		plugins: [builtins(), typescript(), styles()],
	},
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/index.es.js',
			format: 'es',
		},
		plugins: [builtins(), typescript(), styles()],
	},
];
