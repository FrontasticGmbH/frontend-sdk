import { Account } from "@commercetools/types/src/js/account/Account";
import { Address } from "@commercetools/types/src/js/account/Address";
import { Cart } from "@commercetools/types/src/js/cart/Cart";
import { Discount } from "@commercetools/types/src/js/cart/Discount";
import { Order } from "@commercetools/types/src/js/cart/Order";
import { ShippingMethod } from "@commercetools/types/src/js/cart/ShippingMethod";
import { Extension } from "@commercetools/types/src/js/Extension";
import { Variant } from "@commercetools/types/src/js/product/Variant";
import { ProjectSettings } from "@commercetools/types/src/js/ProjectSettings";
import { ResponseError } from "@commercetools/types/src/js/ResponseError";
import { Wishlist } from "@commercetools/types/src/js/wishlist/Wishlist";

export class CoreSDK implements Extension {
    cart: {
        current?: Order;
        addItem: (variant: Variant, quantity: number) => Promise<Cart>;
        updateCart: (payload: {
            account?: { email: string };
            shipping?: Address;
            billing?: Address;
        }) => Promise<Cart>;
        removeItem: (lineItemId: string) => Promise<void>;
        updateItem: (lineItemId: string, newQuantity: number) => Promise<Cart>;
        removeDiscountCode?: (discount: Discount) => Promise<Cart>;
        redeemDiscountCode?: (code: string) => Promise<Cart>;
        setShippingMethod: (shippingMethodId: string) => Promise<Cart>;
        getShippingMethods: () => Promise<ShippingMethod[]>;
        checkout: () => Promise<void>;
        orderHistory?: () => Promise<Order[]>;
        getProjectSettings?: () => Promise<ProjectSettings>;
    },
    account: {
        login: (email: string, password: string) => Promise<Account>;
        logout: () => Promise<void>;
        register: (account: RegisterAccount) => Promise<Account>;
        confirm: (token: string) => Promise<Account>;
        requestConfirmationEmail: (email: string, password: string) => Promise<void>;
        changePassword: (oldPassword: string, newPassword: string) => Promise<Account>;
        requestPasswordReset: (email: string) => Promise<void>;
        resetPassword: (token: string, newPassword: string) => Promise<Account>;
        update: (account: UpdateAccount) => Promise<Account>;
        addAddress: (address: Omit<Address, 'addressId'>) => Promise<Account>;
        updateAddress: (address: Address) => Promise<Account>;
        removeAddress: (addressId: string) => Promise<Account>;
        setDefaultBillingAddress: (addressId: string) => Promise<Account>;
        setDefaultShippingAddress: (addressId: string) => Promise<Account>;
        loggedIn: boolean;
        current?: Account;
        error?: ResponseError;
    },
    wishlist: {
        current?: Wishlist;
        addToWishlist: (sku: string, count?: number) => Promise<Wishlist>;
        removeLineItem: (lineItemId: string) => Promise<Wishlist>;
        updateLineItem: (lineItemId: string, count?: number) => Promise<Wishlist>;
    }

    constructor(extension: Extension) {

    }
}
