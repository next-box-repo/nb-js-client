import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist',
                rootDir: 'src',
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
