import { Address } from './account/Address';
import { Cart } from './cart/Cart';
import { Discount } from './cart/Discount';
import { Order } from './cart/Order';
import { ShippingMethod } from './cart/ShippingMethod';
import { Variant } from './product/Variant';
import { ProjectSettings } from './ProjectSettings';
import { Account } from './account/Account';
import { Wishlist } from './wishlist/Wishlist';
import { ResponseError } from './ResponseError';

interface UpdateAccount {
    firstName?: string;
    lastName?: string;
    salutation?: string;
    birthdayYear?: number;
    birthdayMonth?: number;
    birthdayDay?: number;
}

interface RegisterAccount extends UpdateAccount {
    email: string;
    password: string;
    billingAddress?: Address;
    shippingAddress?: Address;
}

type SDK = {}

class Extension {
    sdk: SDK

    constructor(sdkInstance: SDK) {
        this.sdk = sdkInstance
    }
}




export interface ComposableCommerce extends Extension {
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
        account?: Account;
        error?: ResponseError;
    },
    wishlist: {
        current?: Wishlist;
        addToWishlist: (sku: string, count?: number) => Promise<Wishlist>;
        removeLineItem: (lineItemId: string) => Promise<Wishlist>;
        updateLineItem: (lineItemId: string, count?: number) => Promise<Wishlist>;
    }
}
