# rollup-plugin-aggregate-exports [![Latest version](https://badgen.net/npm/v/rollup-plugin-aggregate-exports)](https://npm.im/rollup-plugin-aggregate-exports) [![Monthly downloads](https://badgen.net/npm/dm/rollup-plugin-aggregate-exports)](https://npm.im/rollup-plugin-aggregate-exports) [![Install size](https://packagephobia.now.sh/badge?p=rollup-plugin-aggregate-exports)](https://packagephobia.now.sh/result?p=rollup-plugin-aggregate-exports)

Emit an entry file to aggregate exports across multiple files.

<sub>If you like this project, please star it & [follow me](https://github.com/privatenumber) to see what other cool projects I'm working on! ❤️</sub>

## 🚀 Install
```sh
npm i -D rollup-plugin-aggregate-exports
```

## 🚦 Quick Setup

```js
import aggregateExports from 'rollup-plugin-aggregate-exports';

const rollupConfig = {
	input: 'src/file.js',
	plugins: [
		aggregateExports({
			// file name for the entry file
			fileName: 'index.js',

			// export statements
			exports: [
				{
					identifier: 'default',
					as: 'entry',
					from: './entry.js',
				},
				{
					identifier: 'default',
					as: 'chunk',
					from: './chunk.js',
				},
			],
		}),
	],
	output: {
		format: 'esm',
		file: 'dist/entry.js',
		exports: 'default',
	},
};

export default rollupConfig;
```

## ⚙️ API

```ts
interface Export {
	/**
	 * Path to import from
	 */
	from: string;

	/**
	 * Identifier to imort
	 */
	identifier: string;

	/**
	 * Name to export as
	 */
	as?: string;
}

aggregateExports(options?: {

	/**
	 * The file name to use for the emitted entry file.
	 * 
	 * @defaultValue `index.js`
	 */
	fileName?: string;


	/**
	 * The exports you want to aggregate.
	 * 
	 * @defaultValue `[]`
	 */
	exports?: (string | Export)[];
});
```
