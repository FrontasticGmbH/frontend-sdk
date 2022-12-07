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
	productAddedToCart: { product: unknown; quantity: number }; //done
	productRemovedFromCart: { product: unknown; quantity: number }; //done
	productUpdatedInCart: { product: unknown; newQuantity: number }; //done
	cartFetched: { cart: unknown }; //done
	cartUpdated: {
		account?: {
			email: string;
		};
		shipping?: unknown;
		billing?: unknown;
	};
	shippingMethodsFetched: { shippingMethods: unknown[] };
	shippingMethodUpdated: { shippingMethod: unknown; event?: unknown };
	discountCodeRedeemed: { discountCode: string; cart?: unknown };
	discountCodeRemoved: { discountCode: string; cart?: unknown };
	cartCheckedOut: { cartId?: string };
	orderFetched: { order: unknown };
	orderPlaced: { order: unknown };
	orderHistoryFetched: { orders: unknown[] };
	orderHistoryUpdated: { order: unknown; event?: unknown };
	userLoggedIn: { userInfo: unknown };
	userLoggedOut: {};
	userRegistered: { email: string };
	accountInfoFetched: { userInfo: unknown };
	accountConfirmed?: { email: string };
	accountConfirmationEmailRequested?: { email: string };
	passwordChanged: {};
	passwordResetRequested: {};
	accountUpdated: { userInfo: unknown; event?: unknown };
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
};

export type DynamicEvent = {
	[key: string]: unknown
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
