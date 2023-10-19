import { CookieSerializeOptions } from "cookie";
import { IncomingMessage, ServerResponse } from "http";

/**
 * An object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Used in server-side rendering and session management.
 */
export interface ServerOptions extends CookieSerializeOptions {
	/**
	 * The server response object created by the server.
	 */
	res?: ServerResponse;
	/**
	 * The incoming message created by the server and cookies.
	 */
	req?: IncomingMessage & {
		cookies?:
			| { [key: string]: string }
			| Partial<{ [key: string]: string }>;
	};
}
