'use strict';

function aggregateExports(options = {}) {
	return {
		name: 'aggregate-exports',
		generateBundle() {
			this.emitFile({
				fileName: options.fileName || 'index.js',
				type: 'asset',
				source: (options.exports || [])
					.map((expFrom) => {
						if (typeof expFrom === 'string') {
							return `export * from '${expFrom}'`;
						}
						const identifiers = (expFrom.identifiers || [expFrom.identifier]).join(',');
						return `export {${identifiers}${expFrom.as ? ` as ${expFrom.as}` : ''}} from '${expFrom.from}'`;
					})
					.join(';'),
			});
		},
	};
}

module.exports = aggregateExports;
