import { IncomingMessage, ServerResponse } from "http";
import { ServerOptions } from "../types/cookieHandling";
import { CookieHandlerSync } from "../library/CookieHandlerSync";
import { REMEMBER_ME_COOKIE_KEY } from "../constants/rememberMeCookieKey";

/**
 * @deprecated Use rememberMeCookieAsync instead. An object containing helper methods for interacting with the remember me cookie, is not compatible with optional cookieHandlingOverride passed in SDK.configure.
 */
export const rememberMeCookie = {
	/**
	 * @deprecated Use rememberMeCookieAsync.get instead. Gets the remember me cookie, is not compatible with optional cookieHandlingOverride passed in SDK.configure.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {boolean} A boolean indicating whether or not the user is to be remembered.
	 */
	get: function (serverOptions?: ServerOptions): boolean {
		if (
			CookieHandlerSync.getCookie(REMEMBER_ME_COOKIE_KEY, serverOptions)
		) {
			return true;
		}
		return false;
	},
	/**
	 * @deprecated Use rememberMeCookieAsync.get instead. Sets the remember me cookie, is not compatible with optional cookieHandlingOverride passed in SDK.configure.
	 *
	 * @param {boolean} rememberMe - The value in which to set the remember me cookie.
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} Void.
	 */
	set: function (rememberMe: boolean, serverOptions?: ServerOptions) {
		if (rememberMe) {
			return CookieHandlerSync.setCookie(
				REMEMBER_ME_COOKIE_KEY,
				"1",
				serverOptions
			);
		} else {
			this.remove();
		}
	},
	/**
	 * @deprecated Use rememberMeCookieAsync.remove instead. Removes the remember me cookie, is not compatible with optional cookieHandlingOverride passed in SDK.configure.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} Void.
	 */
	remove: function (serverOptions?: ServerOptions) {
		return CookieHandlerSync.deleteCookie(
			REMEMBER_ME_COOKIE_KEY,
			serverOptions
		);
	},
};

/**
 * @deprecated An object containing helper methods for interacting with the server session.
 */
export const serverSession = {
	/**
	 * @deprecated Pass the {@link IncomingMessage} and {@link ServerResponse} to cookie helpers directly instead. Used to retieve the session string, is not compatible with optional cookieHandlingOverride passed in SDK.configure.
	 *
	 * @param {IncomingMessage} req - The incoming message created by the server.
	 * @param {ServerResponse} res - The server response object created by the server.
	 */
	get: function (
		req: IncomingMessage,
		res: ServerResponse
	): string | undefined {
		return CookieHandlerSync.getCookie("frontastic-session", {
			req,
			res,
		})?.toString();
	},
};
