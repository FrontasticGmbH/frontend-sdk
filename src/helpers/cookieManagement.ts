import { IncomingMessage, ServerResponse } from "http";
import { deleteCookie, getCookie, setCookie } from "../cookieHandling";

const REMEMBER_ME = "__rememberMe";

/**
 * An object containing helper methods for interacting with the remember me cookie.
 */
export const rememberMeCookie = {
	/**
	 * Gets the remember me cookie on client-side rendered pages and components.
	 *
	 * @returns {boolean} A boolean indicating whether or not the user is to be remembered.
	 */
	get: function (): boolean {
		if (getCookie(REMEMBER_ME)) {
			return true;
		}
		return false;
	},
	/**
	 * Sets the remember me cookie on client-side rendered pages and components.
	 *
	 * @param {boolean} rememberMe - The value in which to set the remember me cookie.
	 *
	 * @returns {void} Void.
	 */
	set: function (rememberMe: boolean) {
		if (rememberMe) {
			return setCookie(REMEMBER_ME, "1");
		} else {
			this.remove();
		}
	},
	/**
	 * Removes the remember me cookie on client-side rendered pages and components.
	 *
	 * @returns {void} Void.
	 */
	remove: function () {
		return deleteCookie(REMEMBER_ME);
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
		return getCookie("frontastic-session", { req, res })?.toString();
	},
};
