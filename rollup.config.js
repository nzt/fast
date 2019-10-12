import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
export default {
    input: 'vm.js',
    output: {
	format: 'commonjs'
    },
    plugins: [
	commonjs(),
	node(),
	babel(),
	terser()
    ]
};
