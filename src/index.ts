import { rememberMeCookie } from "./helpers/cookieManagement";
import { Extension } from "./library/Extension";
import { SDK } from "./library/SDK";
import Event from "./library/Event";
import { FetchError } from "./library/FetchError";

const sdk = new SDK();

export {
    sdk,
    SDK,
    Extension,
    Event,
    FetchError,
    rememberMeCookie
};
