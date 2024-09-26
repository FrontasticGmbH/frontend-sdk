import { CookieManager } from "../cookieHandling";
import { Currency } from "../Currency";
import { RedactionManager } from "../redactionHandling/RedactionManager";
import { RedactionManagerConfig } from "../redactionHandling/RedactionManagerConfig";

type SDKConfig = {
	locale: string;
	currency: Currency;
	endpoint: string;
	extensionVersion: string;
	useCurrencyInLocale?: boolean;
	sessionLifetime?: number;
	cookieHandlingOverride?: CookieManager;
	redactionHandlingOverride?: RedactionManager | RedactionManagerConfig;
	customHeaderValue?: string;
};

export { SDKConfig };
