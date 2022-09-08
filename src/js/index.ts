import { CartMethods, AccountMethods, Extension, WishlistMethods } from "@commercetools/types/src/js/Extension";
import { defaultAccount, defaultCart, defaultWishlist } from "./defaults";

export class CoreSDK implements Extension {
    cart: CartMethods = defaultCart;
    account: AccountMethods = defaultAccount;
    wishlist: WishlistMethods = defaultWishlist;

    constructor(extension: Extension) {

    }
}
