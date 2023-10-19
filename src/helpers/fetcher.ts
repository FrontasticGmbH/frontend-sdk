import { DEFAULT_SESSION_LIFETIME } from "../constants/defaultSessionLifetime";
import { ServerOptions } from "../types/cookieHandling";
import { rememberMeCookieAsync } from "./cookieManagement";
import { FetchError } from "../library/FetchError";
import { diContainer } from "../library/DIContainer";
import { throwIfDINotConfigured } from "./throwIfDINotConfigured";

export const fetcher = async <T>(
	url: string,
	options: RequestInit,
	serverOptions?: ServerOptions,
	sessionLifetime?: number
): Promise<T | FetchError> => {
	throwIfDINotConfigured();
	let sessionCookie = (await diContainer().cookieHandler.getCookie(
		"frontastic-session",
		serverOptions
	)) as string;
	sessionCookie = sessionCookie ?? "";
	const incomingHeaders: { [key: string]: any } = serverOptions?.req
		? { ...serverOptions.req.headers }
		: {};
	delete incomingHeaders["host"];
	delete incomingHeaders["cookie"];

	options.headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-Frontastic-Access-Token": "APIKEY",
		...(options.headers || {}),
		...(sessionCookie ? { "Frontastic-Session": sessionCookie } : {}),
		...incomingHeaders,
	};

	const response: Response = await fetch(url, options);

	if (response.ok && response.headers.has("Frontastic-Session")) {
		let rememberMe = await rememberMeCookieAsync.get();
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(
				Date.now() + (sessionLifetime ?? DEFAULT_SESSION_LIFETIME)
			);
		}
		await diContainer().cookieHandler.setCookie(
			"frontastic-session",
			response.headers.get("Frontastic-Session")!,
			{ expires: expiryDate, ...(serverOptions ?? {}) }
		);
	}

	if (response.ok) {
		return response.json();
	}

	let error: Error | string;

	try {
		error = await response.clone().json();
	} catch (e) {
		error = await response.text();
	}

	return new FetchError(error);
};
