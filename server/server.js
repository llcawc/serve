import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { preview } from "vite";
//#region source/server.ts
const __dirname = cwd();
/**
* Vite based live server for static files
* @param port server port number (default: 3000)
* @param dist folder for serve files (default: dist)
* @param host listen on all addresses, including LAN and public addresses
* @returns Promise void
*/
async function server({ port, dist, host } = {}) {
	if (!port) port = 3e3;
	if (dist) dist = resolve(__dirname, dist);
	else dist = join(__dirname, "dist");
	if (host === void 0) host = void 0;
	else if (host) host = true;
	else host = false;
	const previewServer = await preview({
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
export { server };
