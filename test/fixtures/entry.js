async function entry() {
	const { chunk } = await import('./chunk.js');
	chunk();
}

export default entry;
