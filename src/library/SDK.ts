import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { SDKResponse, Currency, DynamicEvent, StandardEvents } from "./types";
import { FetchError } from "./FetchError";
import { ActionError } from "./ActionError";
import { PageError } from "./PageError";

export class SDK extends EventManager<StandardEvents & DynamicEvent> {
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


		this.on("cartFetched", (event) => {
			console.log("Cart fetched")
		});
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
		this.trigger<"errorCaught">(
			new Event({
				eventName: "errorCaught",
				data: {
					error: error
				}
			})
		);
	}

	async callAction<T>(options: {
		actionName: string,
		payload?: unknown,
		query?: {
			[key: string]: string | number | boolean
		}
	}): Promise<SDKResponse<T>> {
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
		const result = await this.#actionQueue.add<T | FetchError>(() => {
			return fetcher<T>(
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
		}).catch(error => {
			this.#triggerError(new ActionError(options.actionName, new FetchError(error)));
			return {
				isError: true,
				error: new FetchError(<string | Error>error)
			};
		});

		if (result instanceof FetchError) {
			this.#triggerError(new ActionError(options.actionName, result));
			return { isError: true, error: result };
		}
		return { isError: false, data: <T>result };
	}


	async getPage<T>(options: {
		path: string
	}): Promise<SDKResponse<T>> {
		const fetcherOptions = {
			headers: {
				'Frontastic-Path': options.path,
				'Frontastic-Locale': this.APILocale,
				// 'Commercetools-Path': options.path, // TODO: unsupported, needs backend work
				// 'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
			}
		}

		const result = await fetcher<T>(
			this.#normaliseUrl(`${this.#endpoint}/page`),
			fetcherOptions
		).catch(error => {
			this.#triggerError(new PageError(options.path, new FetchError(error as string | Error)))
			return new FetchError(error as string | Error);
		});

		if (result instanceof FetchError) {
			this.#triggerError(new PageError(options.path, result));
			return { isError: true, error: result };
		}
		return { isError: false, data: <T>result };
	}
}
