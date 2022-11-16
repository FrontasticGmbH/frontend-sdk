import { rememberMeCookie } from "./helpers/cookieManagement";
import { Extension } from "./library/Extension";
import { SDK } from "./library/SDK";

const sdk = new SDK();

export { sdk, SDK, Extension, rememberMeCookie };
