import babel from 'rollup-plugin-babel';
import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/compiler.ts',
    output: {
        format: 'esm'
    },
    plugins: [
	    commonjs(),
        node(),
        babel({ extensions: ['.ts', '.js'] }),
        terser()
    ]
};
