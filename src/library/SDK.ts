import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { EventManager } from "./EventManager";
import { ActionResponse, Currency, DynamicEvent, StandardEvents } from "./types";
import { FetchError } from "./FetchError";

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

	#isVoid(option: void | {}): option is void {
		return !!!option;
	}

	async callAction<T>(
		actionName: string,
		payload: unknown = {},
		query?: {
			[key: string]: string | number | boolean
		}
	): Promise<ActionResponse<T>> {
		this.#throwIfNotConfigured();
		let params = "";
		if (query) {
			params = Object.keys(query)
				.reduce((prev, key) => {
					if (query[key]) {
						return prev + `${key}=${query[key]}&`
					};
					return prev;
				}, "?")
				.slice(0, params.length - 1);
		}
		const result = await this.#actionQueue.add<T | FetchError>(() => {
			return fetcher<T>(
				this.#normaliseUrl(`${this.#endpoint}/frontastic/action/${actionName}${params}`),
				{
					method: "POST",
					body: JSON.stringify(payload),
					headers: {
						'Frontastic-Locale': this.APILocale,
						//'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
					}
				},
			);
		}).catch(error => {
			return {
				isError: true,
				error: new FetchError(<string | Error>error)
			};
		});

		if (result instanceof FetchError) {
			return { isError: true, error: result }
		}
		return { isError: false, data: <T>result }
	}


	async getPage<T>(path: string): Promise<T & { isError?: boolean } | FetchError> {
		const options = {
			headers: {
				'Frontastic-Path': path,
				'Frontastic-Locale': this.APILocale,
				// 'Commercetools-Path': path, // TODO: unsupported, needs backend work
				// 'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
			}
		}

		const result = await fetcher<T>(
			this.#normaliseUrl(`${this.#endpoint}/page`),
			options
		).catch(error => {
			return new FetchError(error as string | Error);
		});

		if (this.#isVoid(result as any)) {
			return {} as T & { isError?: boolean };
		}
		return result as T & { isError?: boolean } | FetchError;
	}
}
