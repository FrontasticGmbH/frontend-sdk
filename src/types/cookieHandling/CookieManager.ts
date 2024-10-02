import { CookieValueTypes, ServerOptions, TmpCookiesObj } from "./";

/**
 * An interface containing all the cookie management methods.
 */
export interface CookieManager {
	/**
	 * Computes and gets the cookies from the server or the client.
	 *
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {TmpCookiesObj} A key, value pair object of type {@link CookieValueTypes} holding cookie values.
	 */
	getCookies(options?: ServerOptions): Promise<TmpCookiesObj>;

	/**
	 * Gets a cookie with the provided key.
	 *
	 * @param {string} key - A string representing the key value of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {TmpCookiesObj} A key, value pair object of type {@link CookieValueTypes} holding cookie values.
	 */
	getCookie(key: string, options?: ServerOptions): Promise<CookieValueTypes>;

	/**
	 * Sets the cookie from the server or the client.
	 *
	 * @param {string} key - A string representing the key in which to set the cookiee.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} void.
	 */
	setCookie(key: string, data: any, options?: ServerOptions): Promise<void>;

	/**
	 * Deletes the cookie.
	 *
	 * @param {string} key - A string representing the key of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} void.
	 */
	deleteCookie(key: string, options?: ServerOptions): Promise<void>;

	/**
	 * Checks if the cookie is present.
	 *
	 * @param {string} key - A string representing the key of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {boolean} A boolean indicating if the cookie is present.
	 */
	hasCookie(key: string, options?: ServerOptions): Promise<boolean>;
}
