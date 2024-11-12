import { fetcher, FetcherResponse } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { BaseEvents } from "../types/events/BaseEvents";
import { Events } from "../types/events/Events";
import { Currency } from "../types/Currency";
import {
	SDKResponse,
	SDKConfig,
	HandleSuccessfulFetchOptions,
	HandleErrorCaughtOptions,
	HandleApiCallOptions,
} from "../types/sdk";
import { ActionError } from "./ActionError";
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
import { dependencyContainer } from "./DependencyContainer";
import { CookieHandler } from "./CookieHandler";
import { AcceptedPayloadTypes } from "../types/Payload";
import { RedirectResponse } from "../types/api/page/RedirectResponse";
import { Guid } from "./Guid";
import { RedactionManager } from "../types/redactionHandling/RedactionManager";
import { RedactionHandler } from "./RedactionHandler";
import { RedactionManagerConfig } from "../types/redactionHandling/RedactionManagerConfig";
import { defaultRedactionRules } from "../constants/defaultRedactionRules";

export class SDK<ExtensionEvents extends Events> extends EventManager<
	BaseEvents & ExtensionEvents
> {
	private _hasBeenConfigured: boolean;
	private _actionQueue: Queue;

	private _endpoint!: string;
	private _locale!: string;
	private _currency!: Currency;
	private _extensionVersion!: string;
	private _useCurrencyInLocale!: boolean;
	private _sessionLifetime!: number;
	private _customHeaderValue?: string;

	private setEndpoint(url: string): void {
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
		this._endpoint = url.split("/frontastic")[0];
	}

	/**
	 * A function returning the full url endpoint to be called, to be set within the {@link configure} method.
	 */
	endpoint(): string {
		return this._endpoint;
	}

	/**
	 * A function returning the [BCP 47 language tag](http://tools.ietf.org/html/rfc5646) locale, to be set within the {@link configure} method.
	 *
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
	 */
	locale(): string {
		return this._locale;
	}

	private apiHubLocale(): string {
		const apiFormattedLocale = this._locale.replace("-", "_");

		if (this._useCurrencyInLocale) {
			return `${apiFormattedLocale}@${this._currency}`;
		} else {
			return apiFormattedLocale;
		}
	}

	/**
	 * A function returning the string representing the ISO 4217 3-Letter Currency Code, to be set within the {@link configure} method.
	 */
	currency(): Currency {
		return this._currency;
	}

	/**
	 * A function returning the string optionally set within the {@link configure} method, the value to assign to a "coFE-Custom-Configuration" header value in every API call. Overriden on single calls by explicity set customHeaderValue passed in {@link callAction} and {@link PageApi} methods.
	 */
	customHeaderValue() {
		return this._customHeaderValue;
	}

	constructor() {
		super();

		this._hasBeenConfigured = false;
		this._actionQueue = new Queue();
	}

	private throwIfNotConfigured() {
		if (!this._hasBeenConfigured) {
			throw new Error(SDK_NOT_CONFIGURED_ERROR_MESSAGE);
		}
	}

	private isRedactionManager(
		config?: RedactionManager | RedactionManagerConfig
	): config is RedactionManager {
		return Boolean(
			(config as RedactionManager)?.redact &&
				(config as RedactionManager)?.redactUrl
		);
	}

	/**
	 * The method that must be called prior to any other methods to configure the connection to the backend. An error is throw if not called prior.
	 *
	 * @param {string} config.locale - A string representing the combination of the ISO 639-1 language and ISO 3166-1 country code. For example "en-DE" or "en_DE".
	 * @param {string} config.currency - A string representing the ISO 4217 3-Letter Currency Code, for example EUR.
	 * @param {string} config.endpoint - A string representing the full URL of the endpoint to be called.
	 * @param {string} config.extensionVersion - A string representing the next public extension build ID, to specify the extension version in which to connect.
	 * @param {boolean} [config.useCurrencyInLocale=false] - An optional boolean, default false. To be set to true if currency is required in config.locale, for example en-GB@EUR.
	 * @param {string} [config.sessionLifetime=7776000000] - An optional number of milliseconds in which to persist the session lifeTime, to override the {@link DEFAULT_SESSION_LIFETIME} of 3 months.
	 * @param {boolean} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value in every API call. Overriden on single calls by explicity set customHeaderValue passed in {@link callAction} and {@link PageApi} methods.
	 * @param {CookieManager} [config.cookieHandlingOverride] - An optional cookie manager interface that contains all the cookie handling methods.
	 * @param {RedactionManager | RedactionManagerConfig} [config.redactionHandlingOverride] - An optional class/object implementing the {@link RedactionManager} interface or {@link RedactionManagerConfig} to replace the default {@link defaultRedactionRules} passed to the inbuilt {@link RedactionHandler}.
	 *
	 * @returns {void} Void.
	 */
	configure(config: SDKConfig) {
		dependencyContainer().configure({
			cookieHandler: config.cookieHandlingOverride ?? new CookieHandler(),
			redactHandler: this.isRedactionManager(
				config.redactionHandlingOverride
			)
				? config.redactionHandlingOverride
				: new RedactionHandler(
						config.redactionHandlingOverride ??
							defaultRedactionRules
				  ),
		});
		this.setEndpoint(config.endpoint);
		this.configureLocale(config);
		this._useCurrencyInLocale = config.useCurrencyInLocale ?? false;
		this._extensionVersion = config.extensionVersion;
		this._sessionLifetime =
			config.sessionLifetime ?? DEFAULT_SESSION_LIFETIME;
		this._customHeaderValue = config.customHeaderValue;

		this._hasBeenConfigured = true;
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
			this._currency = currency as Currency;
		}

		// explicitly defined currency overrides that
		if (config.currency) {
			this._currency = config.currency;
		}

		this._locale = locale.replace(/_/g, "-");
	}

	private handleApiCall(options: HandleApiCallOptions) {
		[
			options.type === "pageAPI" ? "pageApiMethodCalled" : "actionCalled",
			"fetchCalled",
		].forEach((eventName) => {
			const type =
				eventName === "fetchCalled" ? { type: options.type } : {};
			this.trigger(
				// @ts-ignore
				new Event({
					eventName,
					data: Object.assign(
						options.type === "pageAPI"
							? { method: options.method }
							: { actionName: options.actionName },
						{
							...type,
							parameters: dependencyContainer()
								.redactHandler()
								.redact(
									JSON.parse(
										JSON.stringify(options.parameters)
									)
								),
							url: dependencyContainer()
								.redactHandler()
								.redactUrl(options.url),
							tracing: options.tracing,
						}
					),
				})
			);
		});
	}

	private handleSuccesfulCall(options: HandleSuccessfulFetchOptions) {
		[
			options.type === "pageAPI"
				? "pageApiFetchSuccessful"
				: "actionFetchSuccessful",
			"fetchSuccessful",
		].forEach((eventName) => {
			const type =
				eventName === "fetchSuccessful" ? { type: options.type } : {};
			this.trigger(
				// @ts-ignore
				new Event({
					eventName,
					data: Object.assign(
						options.type === "pageAPI"
							? { method: options.method }
							: { actionName: options.actionName },
						{
							...type,
							parameters: dependencyContainer()
								.redactHandler()
								.redact(
									JSON.parse(
										JSON.stringify(options.parameters)
									)
								),
							url: dependencyContainer()
								.redactHandler()
								.redactUrl(options.url),
							dataResponse: dependencyContainer()
								.redactHandler()
								.redact(
									JSON.parse(
										JSON.stringify(options.dataResponse)
									)
								),
							tracing: options.tracing,
						}
					),
				})
			);
		});
	}

	private handleError<T>(options: HandleErrorCaughtOptions): SDKResponse<T> {
		[
			options.type === "action"
				? "actionErrorCaught"
				: "pageApiErrorCaught",
			"errorCaught",
		].forEach((eventName) => {
			const type =
				eventName === "errorCaught" ? { type: options.type } : {};
			this.trigger(
				// @ts-ignore
				new Event({
					eventName,
					data: Object.assign(
						options.type === "action"
							? { actionName: options.actionName }
							: { method: options.method },
						{
							...type,
							parameters: dependencyContainer()
								.redactHandler()
								.redact(
									JSON.parse(
										JSON.stringify(options.parameters)
									)
								),
							url: dependencyContainer()
								.redactHandler()
								.redactUrl(options.url),
							tracing: options.tracing,
							error: options.error,
						}
					),
				})
			);
		});

		return {
			isError: true,
			tracing: options.tracing,
			error: options.error,
		};
	}

	private getDefaultAPIHeaders(customHeaderValue?: string) {
		const customValue = customHeaderValue ?? this._customHeaderValue;
		const customHeader: {
			"coFE-Custom-Configuration"?: string;
		} = customValue ? { "coFE-Custom-Configuration": customValue } : {};
		return {
			"Frontastic-Locale": this.apiHubLocale(),
			"Frontastic-Currency": this._currency,
			"Commercetools-Frontend-Extension-Version": this._extensionVersion,
			...customHeader,
		};
	}

	/**
	 * The method used to call extension actions.
	 *
	 * @param {string} options.actionName - The name of the action corresponding to the location of the extension, for example "product/getProduct".
	 * @param {unknown} [options.payload] - An optional key, value pair object payload to be serialised into the body of the request.
	 * @param {Object.<string, number, boolean, string[], number[], boolean[]>} [options.query] - An optional key, value pair object to be serialised into the url query.
	 * @param {boolean} [options.parallel] - An optional boolean, default true indicating whether the action should executed asyncronously or be added to a queue and executed in sequence. Useful to supply false on actions you may think have race conditions.
	 * @param {string} [options.customHeaderValue] - An optional string, the value to assign to a "coFE-Custom-Configuration" header value. Overrides customHeaderValue passed in {@link configure}.
	 * @param {Object} [options.serverOptions] - An optional object containing the res and req objects for ServerResponse and IncomingMessage with cookies respectively. Required for server-side rendering session management.
	 *
	 * @returns {PromiseLike<Object>} An object with a boolean isError property, and either an error or data property for true and false respectively. Type of data will match generic argument supplied to method.
	 */
	async callAction<ReturnData>(options: {
		actionName: string;
		payload?: AcceptedPayloadTypes;
		query?: AcceptedQueryTypes;
		parallel?: boolean;
		customHeaderValue?: string;
		serverOptions?: ServerOptions;
	}): Promise<SDKResponse<ReturnData>> {
		this.throwIfNotConfigured();
		const params = options.query ? generateQueryString(options.query) : "";
		const fetcherOptions = {
			method: "POST",
			body: JSON.stringify(options.payload ?? {}),
			headers: this.getDefaultAPIHeaders(options.customHeaderValue),
		};

		let response: FetcherResponse<ReturnData>;
		const url = normaliseUrl(
			`${this._endpoint}/frontastic/action/${options.actionName}${params}`
		);
		const action = () =>
			fetcher<ReturnData>(
				url,
				fetcherOptions,
				options.serverOptions,
				this._sessionLifetime
			);

		const frontendRequestId = Guid.NewGuid();
		this.handleApiCall({
			type: "action",
			actionName: options.actionName,
			parameters: {
				query: options.query,
				body: options.payload,
			},
			url,
			tracing: {
				frontendRequestId,
			},
		});

		try {
			if (options.parallel === false) {
				response = await this._actionQueue.add<ReturnData>(action);
			} else {
				response = await action();
			}
		} catch (error) {
			return this.handleError<ReturnData>({
				type: "action",
				parameters: {
					query: options.query,
					body: options.payload,
				},
				url,
				actionName: options.actionName,
				tracing: {
					frontendRequestId,
					frontasticRequestId: "",
				},
				error: new ActionError({
					error: error as Error,
				}),
			});
		}
		if (response.isError) {
			return this.handleError<ReturnData>({
				type: "action",
				parameters: {
					query: options.query,
					body: options.payload,
				},
				url,
				actionName: options.actionName,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
				error: new ActionError({
					error: response.error,
				}),
			});
		}

		this.handleSuccesfulCall({
			type: "action",
			actionName: options.actionName,
			parameters: {
				query: options.query,
				body: options.payload,
			},
			url,
			dataResponse: response.data,
			tracing: {
				frontendRequestId,
				frontasticRequestId: response.frontasticRequestId,
			},
		});

		return {
			isError: false,
			tracing: {
				frontendRequestId,
				frontasticRequestId: response.frontasticRequestId,
			},
			data: response.data,
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
			this.throwIfNotConfigured();
			const params = options.query
				? generateQueryString(options.query)
				: "";
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Path": options.path,
					...this.getDefaultAPIHeaders(options.customHeaderValue),
				},
			};

			let response: FetcherResponse<PageResponse | RedirectResponse>;
			const url = normaliseUrl(
				`${this._endpoint}/frontastic/page${params}`
			);

			const frontendRequestId = Guid.NewGuid();
			this.handleApiCall({
				type: "pageAPI",
				method: "getPage",
				parameters: {
					query: options.query,
				},
				url,
				tracing: {
					frontendRequestId,
				},
			});

			try {
				response = await fetcher<PageResponse | RedirectResponse>(
					url,
					fetcherOptions,
					options.serverOptions,
					this._sessionLifetime
				);
			} catch (error) {
				return this.handleError<PageResponse | RedirectResponse>({
					type: "pageAPI",
					parameters: {
						query: options.query,
					},
					url,
					method: "getPage",
					tracing: {
						frontendRequestId,
						frontasticRequestId: "",
					},
					error: new ActionError({
						error: error as Error,
					}),
				});
			}
			if (response.isError) {
				return this.handleError<PageResponse | RedirectResponse>({
					type: "pageAPI",
					parameters: {
						query: options.query,
					},
					url,
					method: "getPage",
					tracing: {
						frontendRequestId,
						frontasticRequestId: response.frontasticRequestId,
					},
					error: new ActionError({
						error: response.error,
					}),
				});
			}

			this.handleSuccesfulCall({
				type: "pageAPI",
				method: "getPage",
				parameters: {
					query: options.query,
				},
				url,
				dataResponse: response.data,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
			});

			return {
				isError: false,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
				data: response.data,
			};
		},
		getPreview: async (options: {
			previewId: string;
			customHeaderValue?: string;
			serverOptions?: ServerOptions;
		}) => {
			this.throwIfNotConfigured();
			const fetcherOptions = {
				method: "POST",
				headers: this.getDefaultAPIHeaders(options.customHeaderValue),
			};
			let response: FetcherResponse<PagePreviewResponse>;
			const query = {
				previewId: options.previewId,
				locale: this.apiHubLocale(),
			};
			const url = normaliseUrl(
				`${this._endpoint}/frontastic/preview${generateQueryString(
					query
				)}`
			);

			const frontendRequestId = Guid.NewGuid();
			this.handleApiCall({
				type: "pageAPI",
				method: "getPreview",
				parameters: {
					query,
				},
				url,
				tracing: {
					frontendRequestId,
				},
			});

			try {
				response = await fetcher<PagePreviewResponse>(
					url,
					fetcherOptions,
					options.serverOptions,
					this._sessionLifetime
				);
			} catch (error) {
				return this.handleError<PagePreviewResponse>({
					type: "pageAPI",
					parameters: {
						query,
					},
					url,
					method: "getPreview",
					tracing: {
						frontendRequestId,
						frontasticRequestId: "",
					},
					error: new ActionError({
						error: error as Error,
					}),
				});
			}
			if (response.isError) {
				return this.handleError<PagePreviewResponse>({
					type: "pageAPI",
					parameters: {
						query,
					},
					url,
					method: "getPreview",
					tracing: {
						frontendRequestId,
						frontasticRequestId: response.frontasticRequestId,
					},
					error: new ActionError({
						error: response.error,
					}),
				});
			}

			this.handleSuccesfulCall({
				type: "pageAPI",
				method: "getPreview",
				parameters: {
					query,
				},
				url,
				dataResponse: response.data,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
			});

			return {
				isError: false,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
				data: response.data,
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
			this.throwIfNotConfigured();
			options.depth = options.depth ?? 16;
			options.types = options.types ?? "static";
			const fetcherOptions = {
				method: "POST",
				headers: this.getDefaultAPIHeaders(options.customHeaderValue),
			};

			let response: FetcherResponse<PageFolderListResponse>;

			const query = {
				locale: this.apiHubLocale(),
				path: options.path ?? "",
				depth: options.depth,
			};
			const url = normaliseUrl(
				`${this._endpoint}/frontastic/structure${generateQueryString(
					query
				)}`
			);

			const frontendRequestId = Guid.NewGuid();
			this.handleApiCall({
				type: "pageAPI",
				method: "getPages",
				parameters: {
					query,
				},
				url,
				tracing: {
					frontendRequestId,
				},
			});

			try {
				response = await fetcher<PageFolderListResponse>(
					url,
					fetcherOptions,
					options.serverOptions,
					this._sessionLifetime
				);
			} catch (error) {
				return this.handleError<PageFolderListResponse>({
					type: "pageAPI",
					parameters: {
						query,
					},
					url,
					method: "getPages",
					tracing: {
						frontendRequestId,
						frontasticRequestId: "",
					},
					error: new ActionError({
						error: error as Error,
					}),
				});
			}
			if (response.isError) {
				return this.handleError<PageFolderListResponse>({
					type: "pageAPI",
					parameters: {
						query,
					},
					url,
					method: "getPages",
					tracing: {
						frontendRequestId,
						frontasticRequestId: response.frontasticRequestId,
					},
					error: new ActionError({
						error: response.error,
					}),
				});
			}

			this.handleSuccesfulCall({
				type: "pageAPI",
				method: "getPages",
				parameters: {
					query,
				},
				url,
				dataResponse: response.data,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
			});

			return {
				isError: false,
				tracing: {
					frontendRequestId,
					frontasticRequestId: response.frontasticRequestId,
				},
				data: <PageFolderListResponse>response.data,
			};
		},
	};
}
