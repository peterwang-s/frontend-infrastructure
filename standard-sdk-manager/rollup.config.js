import babel from '@rollup/plugin-babel';
// import { uglify } from 'rollup-plugin-uglify';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from '@rollup/plugin-inject';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import filesize from 'rollup-plugin-filesize';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';
import path from 'path';
// import pkg from './package.json';

const sdk = process.env.SDK || 'analytics-browser';
const isTs = process.env.TS === 'true';
const pkg = JSON.parse(fs.readFileSync(`./projects/${sdk}/package.json`, 'utf-8').toString());
const { NODE_ENV = 'development' } = process.env;
const isProd = NODE_ENV === 'production';
const isPublish = process.env.NPM === 'publish';
const isDev = NODE_ENV === 'development' && process.env.SERVE === 'true';
const mulitLangProAndLangObj = {};

if (sdk === 'locale') {
    const getMulitLangProAndLang = (dir, lang) => {
        fs.readdirSync(dir).forEach((file) => {
            const pathName = path.join(dir, file);
            if (fs.statSync(pathName).isDirectory()) {
                lang[file] = [];
                getMulitLangProAndLang(pathName, lang);
            } else {
                let arr = dir.split('/');
                let project = arr[arr.length - 1];
                lang[project].push(file.split('.')[0]);
            }
        });
    };
    getMulitLangProAndLang(
        path.resolve(__dirname, './projects/locale/lang-warehouse'),
        mulitLangProAndLangObj,
    );
}

console.log('打包环境:', process.env.NODE_ENV);
// console.log('打包sdk:', process.env.SDK);
// console.log('pkg:', process.env.NPM);
const extensions = ['.ts', '.js'];
let defaults = { compilerOptions: { declaration: true } };
let override = { compilerOptions: { declaration: false } };

const rollupConfig = [
    {
        input: isTs ? `projects/${sdk}/packages/index.ts` : `projects/${sdk}/packages/index.js`,
        output: [
            {
                name: 'Analytics',
                exports: 'named',
                file: isPublish ? `dist/${pkg['browser:source']}` : `dist/${pkg.browser}`,
                format: 'umd',
                // globals: {
                //     //   utils: 'utils'
                //     axios: 'axios',
                // },
                banner: `/** @license ${sdk}.js v${pkg.version} (c) 1995-2025 Huami. All Rights Reserved. License: http://huami.com */`,
            },
            isPublish && {
                file: `dist/${pkg['cjs:main']}`,
                format: 'cjs',
                exports: 'named',
            },
            isPublish && {
                file: `dist/${pkg.main}`,
                format: 'es',
            },
        ],
        watch: {
            include: 'projects/**/*',
        },
        external: [
            'window.LANG',
            'es6-promise',
            'fetch-everywhere',
            ...Object.keys(pkg.dependencies || {}),
            'http',
            'https',
            'url',
            'assert',
            'stream',
            'tty',
            'util',
            'os',
            'zlib',
        ],
        plugins: [
            resolve({
                // modulesOnly: true,
                // browser: true,
                jsnext: true,
                preferBuiltins: true,
                browser: true,
                extensions,
            }),
            typescript({
                exclude: 'node_modules/**',
                typescript: require('typescript'),
                tsconfigDefaults: defaults,
                tsconfig: 'tsconfig.json',
                tsconfigOverride: override,
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
                'window.LANG': JSON.stringify(mulitLangProAndLangObj),
            }),
            json(),
            babel({
                // exclude: ['package.json', '**/node_modules/**'],
                // plugins: ['@babel/external-helpers'],
                extensions,
                babelHelpers: 'runtime',
                skipPreflightCheck: true,
            }),
            nodePolyfills({
                extensions,
            }),
            filesize(),
            isPublish &&
                copy({
                    targets: [
                        {
                            src: [
                                `projects/${sdk}/CHANGELOG.md`,
                                `projects/${sdk}/README.md`,
                                `projects/${sdk}/package.json`,
                            ],
                            dest: 'dist/',
                        },
                    ],
                }),
            del({ targets: 'dist/*' }),
            commonjs(),
            !isPublish && terser(),
            isDev &&
                serve({
                    contentBase: [`projects/${sdk}/dist`, `projects/${sdk}/examples`],
                    open: true,
                }),
            isDev && livereload(),
        ],
    },
];

export default [...rollupConfig];
