import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/bundle.cjs.js',
                format: 'cjs',
            },
            {
                file: 'dist/bundle.esm.js',
                format: 'esm',
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist',
                rootDir: 'src',
            }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
            }),
            terser(),
        ],
    },
    {
        input: 'dist/index.d.ts',
        output: { file: 'dist/index.d.ts', format: 'es' },
        plugins: [dts()],
    },
];
