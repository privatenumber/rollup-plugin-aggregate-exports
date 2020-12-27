const path = require('path');
const { rollup } = require('rollup');
const aggregateExports = require('..');

async function build({ input, opts }) {
	const bundle = await rollup({
		input,
		plugins: [
			aggregateExports(opts),
		],
	});
	const { output } = await bundle.generate({
		format: 'esm',
		exports: 'default',
		chunkFileNames: '[name].js',
	});
	return output;
}

test('no options', async () => {
	const output = await build({
		input: path.join(__dirname, '/fixtures/entry'),
	});

	const aggregatedEntry = output.find(file => file.fileName === 'index.js');
	expect(aggregatedEntry).toMatchObject({
		source: '',
		type: 'asset',
	});
});

test('file name', async () => {
	const output = await build({
		input: path.join(__dirname, '/fixtures/entry'),
		opts: {
			fileName: 'aggregated-entry.js',
		},
	});

	const aggregatedEntry = output.find(file => file.fileName === 'aggregated-entry.js');
	expect(aggregatedEntry).toMatchObject({
		source: '',
		type: 'asset',
	});
});

describe('exports', () => {
	test('export wildcard', async () => {
		const output = await build({
			input: path.join(__dirname, '/fixtures/entry'),
			opts: {
				exports: [
					'./entry.js',
					'./chunk.js',
				],
			},
		});

		const aggregatedEntry = output.find(file => file.fileName === 'index.js');
		expect(aggregatedEntry).toMatchObject({
			type: 'asset',
			source: [
				'export * from \'./entry.js\'',
				'export * from \'./chunk.js\'',
			].join(';'),
		});
	});

	test('export', async () => {
		const output = await build({
			input: path.join(__dirname, '/fixtures/entry'),
			opts: {
				exports: [
					{
						identifier: 'default',
						from: './entry.js',
					},
					{
						identifier: 'chunk',
						from: './chunk.js',
					},
				],
			},
		});

		const aggregatedEntry = output.find(file => file.fileName === 'index.js');
		expect(aggregatedEntry).toMatchObject({
			type: 'asset',
			source: [
				'export {default} from \'./entry.js\'',
				'export {chunk} from \'./chunk.js\'',
			].join(';'),
		});
	});

	test('export as', async () => {
		const output = await build({
			input: path.join(__dirname, '/fixtures/entry'),
			opts: {
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
			},
		});

		const aggregatedEntry = output.find(file => file.fileName === 'index.js');
		expect(aggregatedEntry).toMatchObject({
			type: 'asset',
			source: [
				'export {default as entry} from \'./entry.js\'',
				'export {default as chunk} from \'./chunk.js\'',
			].join(';'),
		});
	});

	test('export dependency', async () => {
		const output = await build({
			input: path.join(__dirname, '/fixtures/entry'),
			opts: {
				exports: [
					{
						identifier: 'rollup',
						from: 'rollup',
					},
					{
						identifier: 'default',
						as: 'entry',
						from: './entry.js',
					},
				],
			},
		});
		const aggregatedEntry = output.find(file => file.fileName === 'index.js');
		expect(aggregatedEntry).toMatchObject({
			type: 'asset',
			source: [
				'export {rollup} from \'rollup\'',
				'export {default as entry} from \'./entry.js\'',
			].join(';'),
		});
	});
});
