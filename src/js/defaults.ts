import { CartMethods, AccountMethods, WishlistMethods } from "@commercetools/types/src/js/Extension";

const notYetImplemented: any = () => {
    throw new Error("CoreSDK must be initialised with commerce extension");
}

export const defaultCart: CartMethods = {
    addItem: notYetImplemented,
    updateCart: notYetImplemented,
    removeItem: notYetImplemented,
    updateItem: notYetImplemented,
    removeDiscountCode: notYetImplemented,
    redeemDiscountCode: notYetImplemented,
    setShippingMethod: notYetImplemented,
    getShippingMethods: notYetImplemented,
    checkout: notYetImplemented,
    orderHistory: notYetImplemented,
    getProjectSettings: notYetImplemented
}

export const defaultAccount: AccountMethods = {
    login: notYetImplemented,
    logout: notYetImplemented,
    register: notYetImplemented,
    confirm: notYetImplemented,
    requestConfirmationEmail: notYetImplemented,
    changePassword: notYetImplemented,
    requestPasswordReset: notYetImplemented,
    resetPassword: notYetImplemented,
    update: notYetImplemented,
    addAddress: notYetImplemented,
    updateAddress: notYetImplemented,
    removeAddress: notYetImplemented,
    setDefaultBillingAddress: notYetImplemented,
    setDefaultShippingAddress: notYetImplemented,
    loggedIn: false
};

export const defaultWishlist: WishlistMethods = {
    addToWishlist: notYetImplemented,
    removeLineItem: notYetImplemented,
    updateLineItem: notYetImplemented
}
