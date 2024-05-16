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
import { normaliseUrl, generateQueryString } from "../helpers/urlHelpers";
import { AcceptedQueryTypes } from "../types/Query";
import { ServerOptions } from "../types/cookieHandling/ServerOptions";
import {
	DEFAULT_SESSION_LIFETIME,
	SDK_NOT_CONFIGURED_ERROR_MESSAGE,
} from "../constants";
import { CookieManager } from "../types/cookieHandling/CookieManager";
import { dependencyContainer } from "./DependencyContainer";
import { CookieHandler } from "./CookieHandler";

type SDKConfig = {
	locale: string;
	currency: Currency;
	endpoint: string;
	useCurrencyInLocale?: boolean;
	extensionVersion?: string;
	sessionLifetime?: number;
	cookieHandlingOverride?: CookieManager;
	customHeaderValue?: string;
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
	#customHeaderValue?: string;

	set endpoint(url: string) {
		url = normaliseUrl(url);
		if (url.indexOf("http") === -1) {
			url = `https://${url}`;
			// Note the below doesn't support websocket connections but much more work would
			// be required for this anyway
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

	get customHeaderValue() {
		return this.#customHeaderValue;
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

	/**
	 * The method that must be called prior to any other methods to configure the connection to the backend. An error is throw if not called prior.
	 *
	 * @param {string} config.locale - A string representing the combination of the ISO 639-1 language and ISO 3166-1 country code. For example "en-DE" or "en_DE".
	 * @param {string} config.currency - A string representing the ISO 3-Letter Currency Code, for example EUR.
	 * @param {string} config.endpoint - A string representing the full URL of the endpoint to be called.
	 * @param {boolean} [config.useCurrencyInLocale=false] - An optional boolean, default false. To be set to true if currency is required in config.locale, for example en-GB@EUR.
	 * @param {string} [config.extensionVersion=""] - An optional string required for multitenancy projects, stored in the environment variable process.env.NEXT_PUBLIC_EXT_BUILD_ID to specify the extension version in which to connect.
	 * @param {string} [config.sessionLifetime=7776000000] - An optional number of milliseconds in which to persist the session lifeTime, to override the {@link DEFAULT_SESSION_LIFETIME} of 3 months.
	 *
	 * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value in every API call. Overriden on single calls by explicity set customHeaderValue passed in {@link callAction} and {@link PageApi} methods.
	 * @param {CookieManager} [config.cookieHandlingOverride] - An optional cookie manager interface that contains all the cookie handling methods.
	 *
	 * @returns {void} Void.
	 */
	configure(config: SDKConfig) {
		dependencyContainer().configure(
			config.cookieHandlingOverride ?? new CookieHandler()
		);
		this.endpoint = config.endpoint;
		this.configureLocale(config);
		this.#useCurrencyInLocale = config.useCurrencyInLocale ?? false;
		this.#extensionVersion = config.extensionVersion ?? "";
		this.#sessionLifetime =
			config.sessionLifetime ?? DEFAULT_SESSION_LIFETIME;
		this.#customHeaderValue = config.customHeaderValue;

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

	#triggerError(
		error: ActionError | PageError,
		frontasticRequestId?: string
	) {
		this.trigger(
			// @ts-ignore
			new Event({
				eventName: "errorCaught",
				data: {
					frontasticRequestId,
					error: error,
				},
			})
		);
	}

	#handleError(
		options:
			| {
					type: "ActionError";
					frontasticRequestId?: string;
					error: string | Error;
					actionName: string;
			  }
			| {
					type: "PageError";
					frontasticRequestId?: string;
					error: string | Error;
					path: string;
			  }
	): {
		isError: true;
		tracing: {
			frontasticRequestId?: string;
		};
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
				: new PageError(options.path, error),
			options.frontasticRequestId
		);
		return {
			isError: true,
			tracing: {
				frontasticRequestId: options.frontasticRequestId,
			},
			error: error,
		};
	}

	#getDefaultAPIHeaders(customHeaderValue?: string) {
		const customValue = customHeaderValue ?? this.#customHeaderValue;
		const customHeader: {
			"coFE-Custom-Configuration"?: string;
		} = customValue ? { "coFE-Custom-Configuration": customValue } : {};
		return {
			"Frontastic-Locale": this.apiHubLocale,
			"Frontastic-Currency": this.currency,
			...(this.#extensionVersion
				? {
						"Commercetools-Frontend-Extension-Version":
							this.#extensionVersion,
				  }
				: {}),
			...customHeader,
		};
	}

	/**
	 * The method used to call extension actions.
	 *
	 * @param {string} options.actionName - The name of the action corresponding to the location of the extension, for example "product/getProduct".
	 * @param {unknown} [options.payload] - An optional key, value pair object payload to be serialised into the body of the request.
	 * @param {Object.<string, number, boolean, string[], number[], boolean[]>} [options.query] - An optional key, value pair object to be serialised into the url query.
	 * @param {boolean} [options.skipQueue] - An optional boolean, default false indicating whether or not to skip the action queue and execute fully asyncronously. May cause race conditions if used incorrectly.
	 * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in {@link configure}.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<Object>} An object with a boolean isError property, and either an error or data property for true and false respectively. Type of data will match generic argument supplied to method.
	 */
	async callAction<ReturnData>(options: {
		actionName: string;
		payload?: unknown;
		query?: AcceptedQueryTypes;
		skipQueue?: boolean;
		customHeaderValue?: string;
		serverOptions?: ServerOptions;
	}): Promise<SDKResponse<ReturnData>> {
		this.#throwIfNotConfigured();
		options.payload = options.payload ?? {};
		const params = options.query ? generateQueryString(options.query) : "";
		const fetcherOptions = {
			method: "POST",
			body: JSON.stringify(options.payload),
			headers: this.#getDefaultAPIHeaders(options.customHeaderValue),
		};

		let response: {
			frontasticRequestId: string;
			data: FetchError | ReturnData;
		};
		const action = () =>
			fetcher<ReturnData>(
				normaliseUrl(
					`${this.#endpoint}/frontastic/action/${
						options.actionName
					}${params}`
				),
				fetcherOptions,
				options.serverOptions,
				this.#sessionLifetime
			);

		try {
			if (options.skipQueue) {
				response = await action();
			} else {
				response = await this.#actionQueue.add<ReturnData | FetchError>(
					action
				);
			}
		} catch (error) {
			return this.#handleError({
				type: "ActionError",
				frontasticRequestId: "",
				error: <string | Error>error,
				actionName: options.actionName,
			});
		}
		if (response.data instanceof Error) {
			return this.#handleError({
				type: "ActionError",
				frontasticRequestId: response.frontasticRequestId,
				error: <string | Error>response.data.toString(),
				actionName: options.actionName,
			});
		}

		return {
			isError: false,
			tracing: {
				frontasticRequestId: response.frontasticRequestId,
			},
			data: <ReturnData>response.data,
		};
	}

	/**
	 * The domain to call page methods on the API hub.
	 */
	page: PageApi = {
		getPage: async (options: {
			path: string;
			query?: AcceptedQueryTypes;
			customHeaderValue?: string;
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
					...this.#getDefaultAPIHeaders(options.customHeaderValue),
				},
			};

			let response: {
				frontasticRequestId: string;
				data: FetchError | PageResponse;
			};
			try {
				response = await fetcher<PageResponse>(
					normaliseUrl(`${this.#endpoint}/frontastic/page${params}`),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: "",
					error: <string | Error>error,
					path: options.path,
				});
			}

			if (response.data instanceof Error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: response.frontasticRequestId,
					error: <string | Error>response.data.toString(),
					path: options.path,
				});
			}

			return {
				isError: false,
				tracing: {
					frontasticRequestId: response.frontasticRequestId,
				},
				data: <PageResponse>response.data,
			};
		},
		getPreview: async (options: {
			previewId: string;
			customHeaderValue?: string;
			serverOptions?: ServerOptions;
		}) => {
			this.#throwIfNotConfigured();
			const fetcherOptions = {
				method: "POST",
				headers: this.#getDefaultAPIHeaders(options.customHeaderValue),
			};
			let response: {
				frontasticRequestId: string;
				data: FetchError | PagePreviewResponse;
			};
			const path = `/preview?previewId=${options.previewId}&locale=${this.apiHubLocale}`;

			try {
				response = await fetcher<PagePreviewResponse>(
					normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: "",
					error: <string | Error>error,
					path: path,
				});
			}

			if (response.data instanceof Error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: response.frontasticRequestId,
					error: <string | Error>response.data.toString(),
					path: path,
				});
			}

			return {
				isError: false,
				tracing: {
					frontasticRequestId: response.frontasticRequestId,
				},
				data: <PagePreviewResponse>response.data,
			};
		},
		getPages: async (
			options: {
				path?: string;
				depth?: number;
				types?: "static";
				customHeaderValue?: string;
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
				headers: this.#getDefaultAPIHeaders(options.customHeaderValue),
			};
			let response: {
				frontasticRequestId: string;
				data: FetchError | PageFolderListResponse;
			};
			const path = `/structure?locale=${this.apiHubLocale}${
				options.path ? `&path=${options.path}` : ""
			}&depth=${options.depth}`;

			try {
				response = await fetcher<PageFolderListResponse>(
					normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions,
					options.serverOptions,
					this.#sessionLifetime
				);
			} catch (error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: "",
					error: <string | Error>error,
					path: path,
				});
			}

			if (response.data instanceof Error) {
				return this.#handleError({
					type: "PageError",
					frontasticRequestId: response.frontasticRequestId,
					error: <string | Error>response.data.toString(),
					path: path,
				});
			}

			return {
				isError: false,
				tracing: {
					frontasticRequestId: response.frontasticRequestId,
				},
				data: <PageFolderListResponse>response.data,
			};
		},
	};
}
