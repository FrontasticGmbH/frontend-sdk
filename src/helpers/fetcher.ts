import Cookies from "js-cookie";
import { REMEMBER_ME } from "../library/types";

const cookiesApi = Cookies.withAttributes({ path: "/" });

export const fetcher = async <T>(
	url: string,
	// currently string to simplify. fetch
	// also allows URLLike and Request:
	// url: RequestInfo,
	options: RequestInit = {},
): Promise<T> => {
	const sessionCookie = cookiesApi.get("frontastic-session");

	// rewrite headers, adding our required default headers
	options.headers = {
		"Content-Type": "application/json",
		Accept: "application/json",
		// "X-Commercetools-Access-Token": "APIKEY", // TODO: unsupported, needs backend work
		"X-Frontastic-Access-Token": "APIKEY",
		...(options.headers || {}),
		...(sessionCookie ? { "Frontastic-Session": sessionCookie } : {}),
	};

	const response: Response = await fetch(url, options);

	if (
		typeof window !== "undefined" &&
		response.ok &&
		response.headers.has("Frontastic-Session")
	) {
		let rememberMe = window.localStorage.getItem(REMEMBER_ME);
		let expiryDate;

		if (rememberMe) {
			expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3); // 3 months
		}

		cookiesApi.set(
			"frontastic-session",
			response.headers.get("Frontastic-Session")!,
			{ expires: expiryDate },
		);
	}

	if (response.ok) {
		return response.json();
	}

	let error: any | string;

	try {
		error = await response.clone().json();
	} catch (e) {
		error = await response.text();
	}

	if (error.error) {
		throw new Error(error.errorCode);
	}

	return error;
};
