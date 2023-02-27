import { Page, PageFolder } from "@frontastic/extension-types"
import { ActionError } from "./ActionError";
import { FetchError } from "./FetchError";
import { PageError } from "./PageError";

export type Currency =
	| "AED"
	| "AFN"
	| "ALL"
	| "AMD"
	| "ANG"
	| "AOA"
	| "ARS"
	| "AUD"
	| "AWG"
	| "AZN"
	| "BAM"
	| "BBD"
	| "BDT"
	| "BGN"
	| "BHD"
	| "BIF"
	| "BMD"
	| "BND"
	| "BOB"
	| "BRL"
	| "BSD"
	| "BTN"
	| "BWP"
	| "BYR"
	| "BZD"
	| "CAD"
	| "CDF"
	| "CHF"
	| "CLP"
	| "CNY"
	| "COP"
	| "CRC"
	| "CUC"
	| "CUP"
	| "CVE"
	| "CZK"
	| "DJF"
	| "DKK"
	| "DOP"
	| "DZD"
	| "EGP"
	| "ERN"
	| "ETB"
	| "EUR"
	| "FJD"
	| "FKP"
	| "GBP"
	| "GEL"
	| "GGP"
	| "GHS"
	| "GIP"
	| "GMD"
	| "GNF"
	| "GTQ"
	| "GYD"
	| "HKD"
	| "HNL"
	| "HRK"
	| "HTG"
	| "HUF"
	| "IDR"
	| "ILS"
	| "IMP"
	| "INR"
	| "IQD"
	| "IRR"
	| "ISK"
	| "JEP"
	| "JMD"
	| "JOD"
	| "JPY"
	| "KES"
	| "KGS"
	| "KHR"
	| "KMF"
	| "KPW"
	| "KRW"
	| "KWD"
	| "KYD"
	| "KZT"
	| "LAK"
	| "LBP"
	| "LKR"
	| "LRD"
	| "LSL"
	| "LYD"
	| "MAD"
	| "MDL"
	| "MGA"
	| "MKD"
	| "MMK"
	| "MNT"
	| "MOP"
	| "MRO"
	| "MUR"
	| "MVR"
	| "MWK"
	| "MXN"
	| "MYR"
	| "MZN"
	| "NAD"
	| "NGN"
	| "NIO"
	| "NOK"
	| "NPR"
	| "NZD"
	| "OMR"
	| "PAB"
	| "PEN"
	| "PGK"
	| "PHP"
	| "PKR"
	| "PLN"
	| "PYG"
	| "QAR"
	| "RON"
	| "RSD"
	| "RUB"
	| "RWF"
	| "SAR"
	| "SBD"
	| "SCR"
	| "SDG"
	| "SEK"
	| "SGD"
	| "SHP"
	| "SLL"
	| "SOS"
	| "SPL"
	| "SRD"
	| "STD"
	| "SVC"
	| "SYP"
	| "SZL"
	| "THB"
	| "TJS"
	| "TMT"
	| "TND"
	| "TOP"
	| "TRY"
	| "TTD"
	| "TVD"
	| "TWD"
	| "TZS"
	| "UAH"
	| "UGX"
	| "USD"
	| "UYU"
	| "UZS"
	| "VEF"
	| "VND"
	| "VUV"
	| "WST"
	| "XAF"
	| "XCD"
	| "XDR"
	| "XOF"
	| "XPF"
	| "YER"
	| "ZAR"
	| "ZMW"
	| "ZWD";

export type Events = {
	[key: string]: {
		[key: string]: unknown;
	};
};

export type StandardEvents = {
	productFetched: { product: unknown };
	productsQueried: { query: unknown; result: unknown };
	productCategoriesQueried: { query: unknown; result: unknown };
	searchableProductAttributesFetched: { filterFields: unknown[] };
	projectSettingsFetched: { projectSettings: unknown };
	productAddedToCart: { product: unknown; quantity: number };
	productRemovedFromCart: { product: unknown; quantity: number };
	productUpdatedInCart: { product: unknown; newQuantity: number };
	cartFetched: { cart: unknown };
	cartUpdated: {
		account?: {
			email: string;
		};
		shipping?: unknown;
		billing?: unknown;
	};
	shippingMethodsFetched: { shippingMethods: unknown[] };
	availableShippingMethodsFetched: { shippingMethods: unknown[] };
	shippingMethodUpdated: { shippingMethod: unknown };
	discountCodeRedeemed: { discountCode: string; cart?: unknown };
	discountCodeRemoved: { discountCode: string; cart?: unknown };
	cartCheckedOut: {};
	orderHistoryFetched: { orders: unknown[] };
	accountFetched: { account: unknown };
	userLoggedIn: { account: unknown };
	userLoggedOut: {};
	userRegistered: { account: unknown };
	accountConfirmed?: { account: unknown };
	accountConfirmationEmailRequested?: { email: string };
	passwordChanged: {};
	passwordResetRequested: {};
	passwordReset: {};
	accountUpdated: { account: unknown };
	accountAddressAdded: { address: unknown };
	accountAddressUpdated: { address: unknown };
	accountAddressRemoved: { addressId: string };
	defaultBillingAddressSet: { address: unknown };
	defaultShippingAddressSet: { address: unknown };
	wishlistFetched: { wishlist: unknown };
	lineItemAddedToWishlist: { lineItem: unknown };
	lineItemRemovedFromWishlist: { lineItemId: string };
	wishlistLineItemUpdated: { lineItem: unknown };
	errorCaught: { error: ActionError | PageError };
};

export type SDKResponse<T> =
	| {
			data: T;
			isError: false;
	  }
	| {
			isError: true;
			error: FetchError;
	  };

export type PageResponse = {
	page: Page,
	pageFolder: PageFolder,
	data: {
		dataSources: {
			[id: string]: any
		}
	}
}
