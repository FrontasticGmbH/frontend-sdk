import { DEFAULT_SESSION_LIFETIME } from "../constants/defaultSessionLifetime";
import { ServerOptions } from "../types/cookieHandling";
import { rememberMeCookieAsync } from "./cookieManagement";
import { FetchError } from "../library/FetchError";
import { dependencyContainer } from "../library/DependencyContainer";

export const fetcher = async <T>(
	url: string,
	options: RequestInit,
	serverOptions?: ServerOptions,
	sessionLifetime?: number
): Promise<{ frontasticRequestId: string; data: T | FetchError }> => {
	dependencyContainer().throwIfDINotConfigured();
	let sessionCookie = (await dependencyContainer().cookieHandler.getCookie(
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
	const frontasticRequestId =
		response.headers.get("Frontastic-Request-Id") ?? "";

	if (response.ok && response.headers.has("Frontastic-Session")) {
		let rememberMe = await rememberMeCookieAsync.get();
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(
				Date.now() + (sessionLifetime ?? DEFAULT_SESSION_LIFETIME)
			);
		}
		await dependencyContainer().cookieHandler.setCookie(
			"frontastic-session",
			response.headers.get("Frontastic-Session")!,
			{ expires: expiryDate, ...(serverOptions ?? {}) }
		);
	}

	if (response.ok) {
		return response.json().then((data) => {
			return { frontasticRequestId, data };
		});
	}

	let error: Error | string;

	try {
		error = await response.clone().json();
	} catch (e) {
		error = await response.text();
	}

	return { frontasticRequestId, data: new FetchError(error) };
};
