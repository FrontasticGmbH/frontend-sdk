import { IncomingMessage, ServerResponse } from "http";
import { CookieHandler } from "../cookieHandling";
import { ServerOptions } from "../cookieHandling/types";

const REMEMBER_ME = "__rememberMe";
const cookieHandler = new CookieHandler();
/**
 * An object containing helper methods for interacting with the remember me cookie.
 */
export const rememberMeCookie = {
	/**
	 * Gets the remember me cookie.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {boolean} A boolean indicating whether or not the user is to be remembered.
	 */
	get: function (serverOptions?: ServerOptions): boolean {
		if (cookieHandler.getCookie(REMEMBER_ME, serverOptions)) {
			return true;
		}
		return false;
	},
	/**
	 * Sets the remember me cookie.
	 *
	 * @param {boolean} rememberMe - The value in which to set the remember me cookie.
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} Void.
	 */
	set: function (rememberMe: boolean, serverOptions?: ServerOptions) {
		if (rememberMe) {
			return cookieHandler.setCookie(REMEMBER_ME, "1", serverOptions);
		} else {
			this.remove();
		}
	},
	/**
	 * Removes the remember me cookie.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} Void.
	 */
	remove: function (serverOptions?: ServerOptions) {
		return cookieHandler.deleteCookie(REMEMBER_ME, serverOptions);
	},
};

/**
 * @deprecated An object containing helper methods for interacting with the server session.
 */
export const serverSession = {
	/**
	 * @deprecated Used to retieve the session string.
	 *
	 * @param {IncomingMessage} req - The incoming message created by the server.
	 * @param {ServerResponse} res - The server response object created by the server.
	 */
	get: function (
		req: IncomingMessage,
		res: ServerResponse
	): string | undefined {
		return cookieHandler
			.getCookie("frontastic-session", { req, res })
			?.toString();
	},
};
