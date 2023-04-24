import { getCookie, setCookie } from "../cookieHandling";
import { ServerOptions } from "../cookieHandling/types";
import { rememberMeCookie } from "../helpers/cookieManagement";
import { FetchError } from "../library/FetchError";

export const fetcher = async <T>(
	url: string,
	options: RequestInit,
	optionsType?: ServerOptions
): Promise<T | FetchError> => {
	const sessionCookie =
		(getCookie("frontastic-session", optionsType) as string) ?? "";

	// rewrite headers, adding our required default headers
	options.headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-Frontastic-Access-Token": "APIKEY",
		...(options.headers || {}),
		...(sessionCookie ? { "Frontastic-Session": sessionCookie } : {}),
	};

	const response: Response = await fetch(url, options);

	if (response.ok && response.headers.has("Frontastic-Session")) {
		let rememberMe = rememberMeCookie.get();
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(Date.now() + 7776000000); // 3 months
		}

		setCookie(
			"frontastic-session",
			response.headers.get("Frontastic-Session")!,
			{ expires: expiryDate, ...(optionsType ?? {}) }
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
