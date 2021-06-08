const path = require('path');
const fs = require('fs');

async function main() {
	fs.rmSync(path.resolve(__dirname, '../dist/lib'), {
		force: true,
		recursive: true,
	});
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
