import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { SDKResponse, Currency, StandardEvents, Events } from "./types";
import { FetchError } from "./FetchError";
import { ActionError } from "./ActionError";
import { PageError } from "./PageError";

export class SDK<ExtensionEvents extends Events> extends EventManager<StandardEvents & ExtensionEvents> {
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

	set locale(locale: string | Intl.Locale) {
		if (typeof locale === "string") {
			this.#locale = new Intl.Locale(locale);
		} else {
			this.#locale = locale;
		}
	}

	get locale(): Intl.Locale {
		return this.#locale;
	}

	get APILocale(): string {
		const apiFormattedLocale = this.locale.baseName
			.slice(0, 5)
			.replace("-", "_");

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
				"Please call .configure before you call any other methods.",
			);
		}
	}

	#normaliseUrl = (url: string): string => url.split("//")
		.reduce((previous, current) => {
			if (current === "http:" || current === "https:") {
				return current += "/";
			}
			return `${previous}/${current}`;
		}, "");

	configure(config: {
		locale: Intl.BCP47LanguageTag;
		currency: Currency;
		endpoint: string;
		useCurrencyInLocale?: boolean;
	}) {
		this.endpoint = config.endpoint;
		this.locale = new Intl.Locale(config.locale);
		this.currency = config.currency;
		this.#useCurrencyInLocale = config.useCurrencyInLocale ?? false;

		this.#hasBeenConfigured = true;
	}

	#triggerError(error: ActionError | PageError) {
		// @ts-ignore
		this.trigger(new Event({
			eventName: "errorCaught",
			data: {
				error: error
			}
		}));
	}

	async callAction<ReturnData>(options: {
		actionName: string,
		payload?: unknown,
		query?: {
			[key: string]: string | number | boolean
		}
	}): Promise<SDKResponse<ReturnData>> {
		this.#throwIfNotConfigured();
		options.payload = options.payload ?? {};
		let params = "";
		if (options.query) {
			params = Object.keys(options.query)
				.reduce((prev, key) => {
					if (options.query![key]) {
						return prev + `${key}=${options.query![key]}&`
					};
					return prev;
				}, "?")
				.slice(0, params.length - 1);
		}

		let result: FetchError | Awaited<ReturnData>;
		try {
			result = await this.#actionQueue.add<ReturnData | FetchError>(() => {
				return fetcher<ReturnData>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic/action/${options.actionName}${params}`),
					{
						method: "POST",
						body: JSON.stringify(options.payload),
						headers: {
							'Frontastic-Locale': this.APILocale,
							//'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
						}
					},
				);
			});
		} catch (error) {
			const actionError = new FetchError(<string | Error>error);
			this.#triggerError(new ActionError(options.actionName, actionError));
			return { isError: true, error: actionError };
		};

		return { isError: false, data: <ReturnData>result };
	}

    // // To be released with the rest of the page and tree api, return type also to be fixed.
	// async getPage<ReturnData>(options: {
	// 	path: string
	// }): Promise<SDKResponse<ReturnData>> {
	// 	const fetcherOptions = {
	// 		headers: {
	// 			'Frontastic-Path': options.path,
	// 			'Frontastic-Locale': this.APILocale,
	// 			// 'Commercetools-Path': options.path, // TODO: unsupported, needs backend work
	// 			// 'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
	// 		}
	// 	}

	// 	let result: FetchError | Awaited<ReturnData>;
	// 	try {
	// 		result = await fetcher<ReturnData>(
	// 			this.#normaliseUrl(`${this.#endpoint}/page`),
	// 			fetcherOptions
	// 		);
	// 	} catch (error) {
	// 		const pageError = new FetchError(<string | Error>error);
	// 		this.#triggerError(new PageError(options.path, pageError));
	// 		return { isError: true, error: pageError };
	// 	};

	// 	return { isError: false, data: <ReturnData>result };
	// }
}
