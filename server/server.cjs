Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let node_path = require("node:path");
let vite = require("vite");
//#region source/server.ts
const __dirname$1 = (0, node_path.resolve)();
/**
* Vite based live server for static files
* @param port server port number (default: 3000)
* @param dist folder for serve files (default: dist)
* @param host listen on all addresses, including LAN and public addresses
* @returns Promise void
*/
async function server({ port, dist, host } = {}) {
	if (!port) port = 3e3;
	if (dist) dist = (0, node_path.resolve)(__dirname$1, dist);
	else dist = (0, node_path.join)(__dirname$1, "dist");
	if (host === void 0) host = void 0;
	else if (host) host = true;
	else host = false;
	const previewServer = await (0, vite.preview)({
		mode: "development",
		build: { outDir: dist },
		preview: {
			port,
			open: false,
			host
		}
	});
	console.log("  ➜  Root:   ", dist);
	previewServer.printUrls();
	previewServer.bindCLIShortcuts({ print: true });
}
//#endregion
exports.server = server;
