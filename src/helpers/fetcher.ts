import Cookies from "js-cookie";
import { REMEMBER_ME } from "../library/types";

const cookiesApi = Cookies.withAttributes({ path: "/" });

export const fetcher = async<T>(
    endpointPath: string,
    locale: Intl.BCP47LanguageTag,
    requestInit: RequestInit = {},
    payload?: unknown,
): Promise<T> => {
    // in case of incorrectly typed DynamicAction
    endpointPath = endpointPath.replaceAll("//", "/");

    const frontasticSessionCookie = cookiesApi.get("frontastic-session");

    requestInit.headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Frontastic-Access-Token": "APIKEY",
        "Frontastic-Locale": locale,
        ...(requestInit.headers || {}),
        ...(frontasticSessionCookie
            ? { "Frontastic-Session": frontasticSessionCookie }
            : {}),
    };

    if (payload) {
        requestInit.body = JSON.stringify(payload);
    }

    const apiHubResponse: Response = await fetch(endpointPath, requestInit);

    if (apiHubResponse.ok && apiHubResponse.headers.has("Frontastic-Session")) {
        let rememberMe = window.localStorage.getItem(REMEMBER_ME);
        let expiryDate;

        if (rememberMe) {
            expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3); // 3 months
        }

        cookiesApi.set(
            "frontastic-session",
            apiHubResponse.headers.get("Frontastic-Session")!,
            { expires: expiryDate },
        );
    }

    if (apiHubResponse.ok) {
        return apiHubResponse.json();
    }

    let error: any | string;

    try {
        error = await apiHubResponse.clone().json();
    } catch (e) {
        error = await apiHubResponse.text();
    }

    if (error.error) {
        throw new Error(error.errorCode);
    }

    return error;
};
