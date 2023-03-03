import { fetcher } from "../helpers/fetcher";
import { Queue } from "./Queue";
import { Event } from "./Event";
import { EventManager } from "./EventManager";
import { SDKResponse, Currency, StandardEvents, Events } from "./types";
import { FetchError } from "./FetchError";
import { ActionError } from "./ActionError";
import { PageError } from "./PageError";
import { PageApi, PageResponse } from "../types/api/page";
import { generateQueryString } from "../helpers/queryStringHelpers";
import { AcceptedQueryTypes } from "../types/Query";

type SDKConfig = {
	locale: string;
	currency?: Currency;
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

  get APILocale(): string {
    console.warn(`WARNING! Getter APILocale has been deprecated, please use the new posixLocale getter instead!`) 
    return this.posixLocale;
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

		if (!this.currency) throw new Error("currency missing");

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
								"Frontastic-Locale": this.posixLocale
								//'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
							},
						}
					);
				}
			);
		} catch (error) {
			const actionError = new FetchError(<string | Error>error);
			this.#triggerError(
				new ActionError(options.actionName, actionError)
			);
			return { isError: true, error: actionError };
		}

		return { isError: false, data: <ReturnData>result };
	}

	page: PageApi = {
		getPage: async (options: { path: string }) => {
			const fetcherOptions = {
				method: "POST",
				headers: {
					"Frontastic-Path": options.path,
					"Frontastic-Locale": this.posixLocale
					// 'Commercetools-Path': options.path, // TODO: unsupported, needs backend work
					// 'Commercetools-Locale': this.APILocale // TODO: unsupported, needs backend work
				},
			};

			let result: FetchError | Awaited<PageResponse>;
			try {
				result = await fetcher<PageResponse>(
					this.#normaliseUrl(`${this.#endpoint}/frontastic/page`),
					fetcherOptions
				);
			} catch (error) {
				const pageError = new FetchError(<string | Error>error);
				this.#triggerError(new PageError(options.path, pageError));
				return { isError: true, error: pageError };
			}

			return { isError: false, data: <PageResponse>result };
		},
	};
}
