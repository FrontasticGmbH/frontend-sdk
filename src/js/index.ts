import { CartMethods, AccountMethods, ComposableCommerce, WishlistMethods } from "./types/Extension";
import { defaultAccount, defaultCart, defaultWishlist } from "./defaults";

export class CoreSDK implements ComposableCommerce {
    sdk: any; //TODO: define and export type in ./types/Extension
    cart: CartMethods = defaultCart;
    account: AccountMethods = defaultAccount;
    wishlist: WishlistMethods = defaultWishlist;

    constructor(extension: ComposableCommerce) {

    }
}
