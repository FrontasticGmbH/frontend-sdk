import Cookies from "js-cookie";
import { rememberMeCookie } from "../helpers/cookieManagement";
import { FetchError } from "../library/FetchError";

const cookiesApi = Cookies.withAttributes({ path: "/" });

export const fetcher = async <T>(
	url: string,
	options: RequestInit = {}
): Promise<T | FetchError> => {
	const sessionCookie = cookiesApi.get("frontastic-session");

	// rewrite headers, adding our required default headers
	options.headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-Frontastic-Access-Token": "APIKEY",
		...(process.env.NEXT_PUBLIC_EXT_BUILD_ID
			? {
					"Commercetools-Frontend-Extension-Version":
						process.env.NEXT_PUBLIC_EXT_BUILD_ID,
			  }
			: {}),
		...(options.headers || {}),
		...(sessionCookie ? { "Frontastic-Session": sessionCookie } : {}),
	};

	const response: Response = await fetch(url, options);

	if (
		typeof window !== "undefined" &&
		response.ok &&
		response.headers.has("Frontastic-Session")
	) {
		let rememberMe = rememberMeCookie.get();
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(Date.now() + 7776000000); // 3 months
		}

		cookiesApi.set(
			"frontastic-session",
			response.headers.get("Frontastic-Session")!,
			{ expires: expiryDate }
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
