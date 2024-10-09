import { DEFAULT_SESSION_LIFETIME } from "../constants/defaultSessionLifetime";
import { ServerOptions } from "../types/cookieHandling";
import { rememberMeCookie } from "./cookieManagement";
import { dependencyContainer } from "../library/DependencyContainer";

type FetcherResponse<T> =
	| { isError: false; frontasticRequestId: string; data: T }
	| { isError: true; frontasticRequestId: string; error: string | Error };

const fetcher = async <T>(
	url: string,
	options: RequestInit,
	serverOptions?: ServerOptions,
	sessionLifetime?: number
): Promise<FetcherResponse<T>> => {
	dependencyContainer().throwIfDINotConfigured();
	let sessionCookie = (await dependencyContainer()
		.cookieHandler()
		.getCookie("frontastic-session", serverOptions)) as string;
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
		let rememberMe = await rememberMeCookie.get();
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(
				Date.now() + (sessionLifetime ?? DEFAULT_SESSION_LIFETIME)
			);
		}
		await dependencyContainer()
			.cookieHandler()
			.setCookie(
				"frontastic-session",
				response.headers.get("Frontastic-Session")!,
				{ expires: expiryDate, ...(serverOptions ?? {}) }
			);
	}

	let error: Error | string;

	if (response.ok) {
		try {
			let data = await response.json();
			return { frontasticRequestId, data, isError: false };
		} catch (err) {
			error = err as Error;
		}
	} else {
		try {
			error = await response.clone().json();
		} catch (e) {
			error = await response.text();
		}
	}

	return { frontasticRequestId, error, isError: true };
};

export { fetcher, FetcherResponse };
