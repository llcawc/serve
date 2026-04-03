//#region source/server.d.ts
interface ServerOptions {
  port?: number | undefined;
  dist?: string | undefined;
  host?: string | boolean | undefined;
}
/**
 * Vite based live server for static files
 * @param port server port number (default: 3000)
 * @param dist folder for serve files (default: dist)
 * @param host listen on all addresses, including LAN and public addresses
 * @returns Promise void
 */
declare function server({
  port,
  dist,
  host
}?: ServerOptions): Promise<void>;
//#endregion
export { type ServerOptions, server };