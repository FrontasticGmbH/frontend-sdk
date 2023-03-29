import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { SDKResponse, Currency, StandardEvents, Events } from "./types";
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

type SDKConfig = {
	locale: string;
	currency: Currency;
	endpoint: string;
	useCurrencyInLocale?: boolean;
};

export class SDK<ExtensionEvents extends Events> extends EventManager<
	StandardEvents & ExtensionEvents
> {
	#hasBeenConfigured;

	#endpoint!: string;
	#locale!: Intl.Locale;
	#currency!: Currency;
	#useCurrencyInLocale!: boolean;
	#actionQueue: Queue;

	set endpoint(url: string) {
		this.#endpoint = url;
	}

	get endpoint() {
		return this.#endpoint;
	}

	set locale(locale: string) {
		this.#locale = new Intl.Locale(locale);
	}

	get locale(): Intl.BCP47LanguageTag {
		return this.#locale.baseName;
	}

	get posixLocale(): string {
		const apiFormattedLocale = this.locale.slice(0, 5).replace("-", "_");

		if (this.#useCurrencyInLocale) {
			return `${apiFormattedLocale}@${this.currency}`;
		} else {
			return apiFormattedLocale;
		}
	}

	set currency(currency: Currency) {
		this.#currency = currency;
	}

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
			throw new Error(
				"The SDK has not been configured.\n" +
					"Please call .configure before you call any other methods."
			);
		}
	}

	#normaliseUrl = (url: string): string =>
		url.split("//").reduce((previous, current) => {
			if (current === "http:" || current === "https:") {
				return (current += "/");
			}
			return `${previous}/${current}`;
		}, "");

	configure(config: SDKConfig) {
		this.endpoint = config.endpoint;
		this.configureLocale(config);
		this.#useCurrencyInLocale = config.useCurrencyInLocale ?? false;

		this.#hasBeenConfigured = true;
	}

	configureLocale(config: Pick<SDKConfig, "locale" | "currency">) {
		// currency present in locale (posix modifier)
		const [locale, currency] = config.locale.split("@");
		if (currency) {
			this.currency = currency as Currency;
		}
		// explicitely defined currency overrides that
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

	async callAction<ReturnData>(options: {
		actionName: string;
		payload?: unknown;
		query?: AcceptedQueryTypes;
	}): Promise<SDKResponse<ReturnData>> {
		this.#throwIfNotConfigured();
		options.payload = options.payload ?? {};
		const params = options.query ? generateQueryString(options.query) : "";

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
						{
							method: "POST",
							body: JSON.stringify(options.payload),
							headers: {
								"Frontastic-Locale": this.posixLocale,
							},
						}
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

	page: PageApi = {
		getPage: async (options: {
			path: string;
			query?: AcceptedQueryTypes;
		}) => {
			const params = options.query
				? generateQueryString(options.query)
				: "";
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Path": options.path,
					"Frontastic-Locale": this.posixLocale,
				},
			};

			let result: FetchError | Awaited<PageResponse>;
			try {
				result = await fetcher<PageResponse>(
					this.#normaliseUrl(
						`${this.#endpoint}/frontastic/page${params}`
					),
					fetcherOptions
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
		getPreview: async (options: { previewId: string }) => {
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Locale": this.posixLocale,
				},
			};
			let result: FetchError | Awaited<PagePreviewResponse>;
			const path = `/preview?previewId=${options.previewId}&locale=${this.posixLocale}`;

			try {
				result = await fetcher<PagePreviewResponse>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions
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
			} = {
				depth: 16,
				types: "static",
			}
		) => {
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Locale": this.posixLocale,
				},
			};
			let result: FetchError | Awaited<PageFolderListResponse>;
			const path = `/structure?locale=${this.posixLocale}${
				options.path ? `&path=${options.path}` : ""
			}${options.depth !== undefined ? `&depth=${options.depth}` : ""}`;

			try {
				result = await fetcher<PageFolderListResponse>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic${path}`),
					fetcherOptions
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
