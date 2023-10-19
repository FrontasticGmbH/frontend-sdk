import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { StandardEvents } from "../types/events/StandardEvents";
import { Events } from "../types/events/Events";
import { Currency } from "../types/Currency";
import { SDKResponse } from "../types/SDKResponse";
import { FetchError } from "./FetchError";
import { ActionError } from "./ActionError";
import { PageError } from "./PageError";
import {
	PageApi,
	PageFolderListResponse,
	PagePreviewResponse,
	PageResponse,
} from "../types/api/page";
import { generateQueryString } from "../helpers/queryStringHelpers";
import { AcceptedQueryTypes } from "../types/Query";
import { ServerOptions } from "../types/cookieHandling/ServerOptions";
import { DEFAULT_SESSION_LIFETIME } from "../constants/defaultSessionLifetime";
import { SDK_NOT_CONFIGURED_ERROR_MESSAGE } from "../constants/sdkNotConfiguredErrorMessage";
import { CookieManager } from "../types/cookieHandling/CookieManager";
import { diContainer } from "./DIContainer";
import { CookieHandler } from "./CookieHandler";

type SDKConfig = {
	locale: string;
	currency: Currency;
	endpoint: string;
	useCurrencyInLocale?: boolean;
	extensionVersion?: string;
	sessionLifetime?: number;
	cookieHandlingOverride?: CookieManager;
};

export class SDK<ExtensionEvents extends Events> extends EventManager<
	StandardEvents & ExtensionEvents
> {
	#hasBeenConfigured;

	#endpoint!: string;
	#locale!: Intl.Locale;
	#currency!: Currency;
	#useCurrencyInLocale!: boolean;
	#extensionVersion!: string;
	#actionQueue: Queue;
	#sessionLifetime!: number;

	set endpoint(url: string) {
		url = this.#normaliseUrl(url);
		if (url.indexOf("http") === -1) {
			url = `https://${url}`;
			// Note the below doesn't support websocket connections but much more work would
			// be rquired for this anyway
			console.warn(
				`Protocol not supplied to endpoint, defaulting to https - ${url}`
			);
		}
		// remove "/frontastic" if applied
		this.#endpoint = url.split("/frontastic")[0];
	}

	/**
	 * The full url endpoint to be called, to be set within the {@link configure} method.
	 */
	get endpoint() {
		return this.#endpoint;
	}

	set locale(locale: string) {
		this.#locale = new Intl.Locale(locale);
	}

	/**
	 * The string representing the combination of the ISO 639-1 language and ISO 3166-1 country code, to be set within the {@link configure} method.
	 */
	get locale(): Intl.BCP47LanguageTag {
		return this.#locale.baseName;
	}

	/**
	 * @deprecated The string representing the locale in the posix format to be used internally.
	 */
	get posixLocale(): string {
		const apiFormattedLocale = this.locale.slice(0, 5).replace("-", "_");

		if (this.#useCurrencyInLocale) {
			return `${apiFormattedLocale}@${this.currency}`;
		} else {
			return apiFormattedLocale;
		}
	}

	/**
	 * The string representing the locale formatted to be used when communicating with the backend.
	 */
	private get apiHubLocale(): string {
		const apiFormattedLocale = this.locale.replace("-", "_");

		if (this.#useCurrencyInLocale) {
			return `${apiFormattedLocale}@${this.currency}`;
		} else {
			return apiFormattedLocale;
		}
	}

	set currency(currency: Currency) {
		this.#currency = currency;
	}

	/**
	 * The string representing the ISO 3-Letter Currency Code, to be set within the {@link configure} method.
	 */
	get currency() {
		return this.#currency;
	}

	constructor() {
		super();

		this.#hasBeenConfigured = false;
		this.#actionQueue = new Queue();
	}

	#throwIfNotConfigured() {
		if (!this.#hasBeenConfigured) {
			throw new Error(SDK_NOT_CONFIGURED_ERROR_MESSAGE);
		}
	}

	#normaliseUrl = (url: string): string =>
		url.split("//").reduce((previous, current) => {
			if (current === "http:" || current === "https:") {
				return (current += "/");
			}
			return `${previous}/${current}`;
		}, "");

	/**
	 * The method that must be called prior to any other methods to configure the connection to the backend. An error is throw if not called prior.
	 *
	 * @param {string} config.locale - A string representing the combination of the ISO 639-1 language and ISO 3166-1 country code. For example "en-DE" or "en_DE".
	 * @param {string} config.currency - A string representing the ISO 3-Letter Currency Code, for example EUR.
	 * @param {string} config.endpoint - A string representing the full URL of the endpoint to be called.
	 * @param {boolean} [config.useCurrencyInLocale=false] - An optional boolean, default false. To be set to true if currency is required in config.locale, for example en-GB@EUR.
	 * @param {string} [config.extensionVersion=""] - An optional string required for multitenancy projects, stored in the environment variable process.env.NEXT_PUBLIC_EXT_BUILD_ID to specify the extension version in which to connect.
	 * @param {string} [config.sessionLifetime=7776000000] - An optional number of milliseconds in which to persist the session lifeTime, to override the {@link DEFAULT_SESSION_LIFETIME} of 3 months.
	 * @param {CookieManager} [config.cookieHandlingOverride] - An optional cookie manager interface that contains all the cookie handling methods.
	 *
	 * @returns {void} Void.
	 */
	configure(config: SDKConfig) {
		diContainer().cookieHandler = new CookieHandler();
		diContainer().hasBeenConfigured = true;
		if (config.cookieHandlingOverride) {
			diContainer().cookieHandler = config.cookieHandlingOverride;
		}
		this.endpoint = config.endpoint;
		this.configureLocale(config);
		this.#useCurrencyInLocale = config.useCurrencyInLocale ?? false;
		this.#extensionVersion = config.extensionVersion ?? "";
		this.#sessionLifetime =
			config.sessionLifetime ?? DEFAULT_SESSION_LIFETIME;

		this.#hasBeenConfigured = true;
	}

	/**
	 * The method called to standardise the locale and currency inputs.
	 *
	 * @param {string} config.locale - A string representing the combination of the ISO 639-1 language and ISO 3166-1 country code. For example en-GB or en_GB.
	 * @param {string} config.currency - A string representing the ISO 3-Letter Currency Code, for example EUR.
	 *
	 * @returns {void} Void.
	 */
	configureLocale(config: Pick<SDKConfig, "locale" | "currency">) {
		// currency present in locale (posix modifier)
		const [locale, currency] = config.locale.split("@");
		if (currency) {
			this.currency = currency as Currency;
		}
		// explicitly defined currency overrides that
		if (config.currency) {
			this.currency = config.currency as Currency;
		}

		this.locale = locale.replace(/_/g, "-");

		// set language, country
		// const [language, country] = locale.split("-")
		// this.country = country;
		// this.language = language;
	}

	#triggerError(error: ActionError | PageError) {
		this.trigger(
			// @ts-ignore
			new Event({
				eventName: "errorCaught",
				data: {
					error: error,
				},
			})
		);
	}

	#handleError(
		options:
			| {
					type: "ActionError";
					error: string | Error;
					actionName: string;
			  }
			| {
					type: "PageError";
					error: string | Error;
					path: string;
			  }
	): {
		isError: true;
		error: FetchError;
	} {
		let error: FetchError;
		if (options.error instanceof FetchError) {
			error = options.error;
		} else {
			error = new FetchError(<string | Error>options.error);
		}
		this.#triggerError(
			options.type === "ActionError"
				? new ActionError(options.actionName, error)
				: new PageError(options.path, error)
		);
		return { isError: true, error: error };
	}

	#getDefaultAPIHeaders() {
		return {
			"Frontastic-Locale": this.apiHubLocale,
			"Frontastic-Currency": this.currency,
			...(this.#extensionVersion
				? {
						"Commercetools-Frontend-Extension-Version":
							this.#extensionVersion,
				  }
				: {}),
		};
	}

	/**
	 * The method used to call extension actions.
	 *
	 * @param {string} options.actionName - The name of the action corresponding to the location of the extension, for example "product/getProduct".
	 * @param {unknown} [options.payload] - An optional key, value pair object payload to be serialised into the body of the request.
	 * @param {Object.<string, number, boolean, string[], number[], boolean[]>} [options.query] - An optional key, value pair object to be serialised into the url query.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<Object>} An object with a boolean isError property, and either an error or data property for true and false respectively. Type of data will match generic argument supplied to method.
	 */
	async callAction<ReturnData>(options: {
		actionName: string;
		payload?: unknown;
		query?: AcceptedQueryTypes;
		serverOptions?: ServerOptions;
	}): Promise<SDKResponse<ReturnData>> {
		this.#throwIfNotConfigured();
		options.payload = options.payload ?? {};
		const params = options.query ? generateQueryString(options.query) : "";
		const fetcherOptions = {
			method: "POST",
			body: JSON.stringify(options.payload),
			headers: this.#getDefaultAPIHeaders(),
		};

		let result: FetchError | Awaited<ReturnData>;
		try {
			result = await this.#actionQueue.add<ReturnData | FetchError>(
				() => {
					return fetcher<ReturnData>(
						this.#normaliseUrl(
							`${this.#endpoint}/frontastic/action/${
								options.actionName
							}${params}`
						),
						fetcherOptions,
						options.serverOptions,
						this.#sessionLifetime
					);
				}
			);
		} catch (error) {
			return this.#handleError({
				type: "ActionError",
				error: <string | Error>error,
				actionName: options.actionName,
			});
		}
		if (result instanceof Error) {
			return this.#handleError({
				type: "ActionError",
				error: <string | Error>result.toString(),
				actionName: options.actionName,
			});
		}

		return { isError: false, data: <ReturnData>result };
	}

	/**
	 * The domain to call page methods on the API hub.
	 */
	page: PageApi = {
		getPage: async (options: {
			path: string;
			query?: AcceptedQueryTypes;
			serverOptions?: ServerOptions;
		}) => {
			this.#throwIfNotConfigured();
			const params = options.query
				? generateQueryString(options.query)
				: "";
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Path": options.path,
					...this.#getDefaultAPIHeaders(),
				},
			};

			let result: FetchError | Awaited<PageResponse>;
			try {
				result = await fetcher<PageResponse>(
					this.#normaliseUrl(
						`${this.#endpoint}/frontastic/page${params}`
					),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>error,
					path: options.path,
				});
			}

			if (result instanceof Error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>result.toString(),
					path: options.path,
				});
			}

			return { isError: false, data: <PageResponse>result };
		},
		getPreview: async (options: {
			previewId: string;
			serverOptions?: ServerOptions;
		}) => {
			this.#throwIfNotConfigured();
			const fetcherOptions = {
				method: "POST",
				headers: this.#getDefaultAPIHeaders(),
			};
			let result: FetchError | Awaited<PagePreviewResponse>;
			const path = `/preview?previewId=${options.previewId}&locale=${this.apiHubLocale}`;

			try {
				result = await fetcher<PagePreviewResponse>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>error,
					path: path,
				});
			}

			if (result instanceof Error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>result.toString(),
					path: path,
				});
			}

			return { isError: false, data: <PagePreviewResponse>result };
		},
		getPages: async (
			options: {
				path?: string;
				depth?: number;
				types?: "static";
				serverOptions?: ServerOptions;
			} = {
				depth: 16,
				types: "static",
			}
		) => {
			this.#throwIfNotConfigured();
			options.depth = options.depth ?? 16;
			options.types = options.types ?? "static";
			const fetcherOptions = {
				method: "POST",
				headers: this.#getDefaultAPIHeaders(),
			};
			let result: FetchError | Awaited<PageFolderListResponse>;
			const path = `/structure?locale=${this.apiHubLocale}${
				options.path ? `&path=${options.path}` : ""
			}&depth=${options.depth}`;

			try {
				result = await fetcher<PageFolderListResponse>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>error,
					path: path,
				});
			}

			if (result instanceof Error) {
				return this.#handleError({
					type: "PageError",
					error: <string | Error>result.toString(),
					path: path,
				});
			}

			return { isError: false, data: <PageFolderListResponse>result };
		},
	};
}
