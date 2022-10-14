import { fetcher } from "../helpers/fetcher";
import EnhancedEmitter from "./EnhancedEmitter";
import { Queue } from "./Queue";
import {
	Currency,
	DynamicAction,
	StandardAction,
	StandardEvents,
} from "./types";

export class SDK extends EnhancedEmitter<StandardEvents, {}> {
	#hasBeenConfigured;

	#endpoint!: string;
	#locale!: Intl.Locale;
	#currency!: Currency;
	#allowOrigin!: string;
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
		return this.locale.baseName.slice(0, 5).replace("-", "_");
	}

	set currency(currency: Currency) {
		this.#currency = currency;
	}

	get currency() {
		return this.#currency;
	}

	set allowOrigin(allowOrigin: string) {
		this.#allowOrigin = allowOrigin;
	}

	get allowOrigin() {
		return this.#allowOrigin;
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

	configure(config: {
		locale: Intl.BCP47LanguageTag;
		currency: Currency;
		endpoint: string;
		allowOrigin?: string;
	}) {
		this.endpoint = config.endpoint;
		this.locale = new Intl.Locale(config.locale);
		this.currency = config.currency;
		this.#allowOrigin = config.allowOrigin ?? "";

		this.#hasBeenConfigured = true;
	}

	async callAction<T>(
		actionName: StandardAction | DynamicAction,
		payload: unknown,
	): Promise<T> {
		this.#throwIfNotConfigured();
		return await this.#actionQueue.add<T>(() =>
			fetcher<T>(
				`${this.#endpoint}/frontastic/action/${actionName}`,
				this.APILocale,
				{
					method: "POST",
					...(this.#allowOrigin
						? { "Access-Control-Allow-Origin": this.#allowOrigin }
						: {}),
				},
				payload,
			),
		);
	}

	getPage(pageName: string) {
		this.#throwIfNotConfigured();
	}
}
