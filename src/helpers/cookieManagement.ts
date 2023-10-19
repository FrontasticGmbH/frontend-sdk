import { ServerOptions } from "../types/cookieHandling";
import { diContainer } from "../library/DIContainer";
import { throwIfDINotConfigured } from "./throwIfDINotConfigured";
import { REMEMBER_ME_COOKIE_KEY } from "../constants/rememberMeCookieKey";

/**
 * An object containing helper methods for interacting with the remember me cookie.
 */
export const rememberMeCookieAsync = {
	/**
	 * Gets the remember me cookie.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {Promise<boolean>} A boolean indicating whether or not the user is to be remembered.
	 */
	get: async function (serverOptions?: ServerOptions): Promise<boolean> {
		throwIfDINotConfigured();
		const rememberMe = await diContainer().cookieHandler.getCookie(
			REMEMBER_ME_COOKIE_KEY,
			serverOptions
		);
		return !!rememberMe;
	},
	/**
	 * Sets the remember me cookie.
	 *
	 * @param {boolean} rememberMe - The value in which to set the remember me cookie.
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {Promise<void>} Void.
	 */
	set: async function (
		rememberMe: boolean,
		serverOptions?: ServerOptions
	): Promise<void> {
		throwIfDINotConfigured();
		if (rememberMe) {
			await diContainer().cookieHandler.setCookie(
				REMEMBER_ME_COOKIE_KEY,
				"1",
				serverOptions
			);
		} else {
			await this.remove();
		}
	},
	/**
	 * Removes the remember me cookie.
	 *
	 * @param {ServerOptions} [serverOptions] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {Promise<void>} Void.
	 */
	remove: async function (serverOptions?: ServerOptions): Promise<void> {
		throwIfDINotConfigured();
		await diContainer().cookieHandler.deleteCookie(
			REMEMBER_ME_COOKIE_KEY,
			serverOptions
		);
	},
};
