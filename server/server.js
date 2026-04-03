import { join, resolve } from 'node:path';
import { preview } from 'vite';
const __dirname = resolve();
/**
 * Vite based live server for static files
 * @param port server port number (default: 3000)
 * @param dist folder for serve files (default: dist)
 * @param host listen on all addresses, including LAN and public addresses
 * @returns Promise void
 */
async function server({ port, dist, host } = {}) {
    if (!port) {
        port = 3000;
    }
    if (dist) {
        dist = resolve(__dirname, dist);
    }
    else {
        dist = join(__dirname, 'dist');
    }
    if (host === undefined) {
        host = undefined;
    }
    else if (host) {
        host = true;
    }
    else {
        host = false;
    }
    const previewServer = await preview({
        // any valid user config options, plus `mode` and `configFile`
        mode: 'development',
        build: {
            outDir: dist,
        },
        preview: {
            port,
            open: false,
            host,
        },
    });
    // Root log
    console.log('  ➜  Root:   ', dist);
    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
}
// export
export { server };
