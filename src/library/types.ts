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

export type StandardEvents = {
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
	shippingMethodUpdated: { shippingMethod: unknown; };
	discountCodeRedeemed: { discountCode: string; cart?: unknown };
	discountCodeRemoved: { discountCode: string; cart?: unknown };
	cartCheckedOut: {};
	orderHistoryFetched: { orders: unknown[] };
	accountFetched: { account: unknown };
	userLoggedIn: { account: unknown };
	userLoggedOut: {};
	userRegistered: { email: string };
	accountInfoFetched: { account: unknown };
	accountConfirmed?: { email: string };
	accountConfirmationEmailRequested?: { email: string };
	passwordChanged: {};
	passwordResetRequested: {};
	accountUpdated: { account: unknown; event?: unknown };
	accountAddressAdded: { address: unknown };
	accountAddressUpdated: { address: unknown; event?: unknown };
	accountAddressRemoved: { addressId: string };
	billingAddressAdded: { address: unknown; isDefault: boolean };
	billingAddressUpdated: {
		address: unknown;
		event?: unknown;
		isDefault: boolean;
	};
	shippingAddressAdded: { address: unknown; isDefault: boolean };
	shippingAddressUpdated: {
		address: unknown;
		event?: unknown;
		isDefault: boolean;
	};
	productAddedToWishlist: { product: unknown };
	productRemovedFromWishlist: { productId: string };
	wishlistFetched: { wishlist: unknown };
	errorCaught: { error: ActionError | PageError }
};

export type DynamicEvent = {
	[key: string]: {
		[key: string]: unknown
	}
}

export type StandardAction =
	| "account/getAccount"
	| "account/register"
	| "account/requestConfirmationEmail"
	| "account/confirm"
	| "account/login"
	| "account/logout"
	| "account/password"
	| "account/requestReset"
	| "account/reset"
	| "account/update"
	| "account/addAddress"
	| "account/updateAddress"
	| "account/removeAddress"
	| "account/setDefaultBillingAddress"
	| "account/setDefaultShippingAddress"
	| "cart/getCart"
	| "cart/addToCart"
	| "cart/updateLineItem"
	| "cart/removeLineItem"
	| "cart/updateCart"
	| "cart/checkout"
	| "cart/getOrders"
	| "cart/getShippingMethods"
	| "cart/getAvailableShippingMethods"
	| "cart/setShippingMethod"
	| "cart/addPaymentByInvoice"
	| "cart/updatePayment"
	| "cart/redeemDiscount"
	| "cart/removeDiscount"
	| "product/getProduct"
	| "product/query"
	| "product/queryCategories"
	| "product/searchableAttributes"
	| "wishlist/getWishlist"
	| "wishlist/createWishlist"
	| "wishlist/addToWishlist"
	| "wishlist/removeLineItem"
	| "wishlist/updateLineItemCount"
	| "project/getProjectSettings"
	| "payment/createSession"
	| "payment/notifications";

export type SDKResponse<T> = {
	data: T;
	isError: false;
} | {
	isError: true;
	error: FetchError
}
