import {
	CookieValueTypes,
	ServerOptions,
	TmpCookiesObj,
} from "../cookieHandling/types";

/**
 * An interface containing all the cookie management methods.
 */
export interface CookieManager {
	/**
	 * Checks if the window object is defined to determine if it is client/server.
	 *
	 * @returns {boolean} A boolean indicating whether or not the window object is defined.
	 */
	isClientSide(): boolean;

	/**
	 * Converts the value to JSON string.
	 *
	 * @param {string} value - The string value to be stringified.
	 *
	 * @returns {string} The stringified string value.
	 */
	stringify(value: string): string;

	/**
	 * Decodes the given value.
	 *
	 * @param {string} str - The string value to be decoded.
	 *
	 * @returns {string} The decoded string value.
	 */
	decode(str: string): string;

	/**
	 * Processes the given value, and returns the cookie value in its proper type.
	 *
	 * @param {string} value - The string value to be processed to its correct type.
	 *
	 * @returns {CookieValueTypes} The cookie processed to it's actual {@link CookieValueTypes} value.
	 */
	processValue(value: string): CookieValueTypes;

	/**
	 * Computes and gets the cookies from the server or the client.
	 *
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {TmpCookiesObj} A key, value pair object of type {@link CookieValueTypes} holding cookie values.
	 */
	getCookies(options?: ServerOptions): TmpCookiesObj;

	/**
	 * Gets a cookie with the provided key.
	 *
	 * @param {string} key - A string representing the key value of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {TmpCookiesObj} A key, value pair object of type {@link CookieValueTypes} holding cookie values.
	 */
	getCookie(key: string, options?: ServerOptions): CookieValueTypes;

	/**
	 * Sets the cookie from the server or the client.
	 *
	 * @param {string} key - A string representing the key in which to set the cookiee.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} void.
	 */
	setCookie(key: string, data: any, options?: ServerOptions): void;

	/**
	 * Deletes the cookie.
	 *
	 * @param {string} key - A string representing the key of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {void} void.
	 */
	deleteCookie(key: string, options?: ServerOptions): void;

	/**
	 * Checks if the cookie is present.
	 *
	 * @param {string} key - A string representing the key of the cookie.
	 * @param {ServerOptions} [options] - An optional {@link ServerOptions} object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {boolean} A boolean indicating if the cookie is present.
	 */
	hasCookie(key: string, options?: ServerOptions): boolean;
}
