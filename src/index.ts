import { rememberMeCookie } from "./helpers/cookieManagement";
import { Extension } from "./library/Extension";
import { SDK } from "./library/SDK";
import Event from "./library/Event";

const sdk = new SDK();

export {
    sdk,
    SDK,
    Extension,
    Event,
    rememberMeCookie
};
