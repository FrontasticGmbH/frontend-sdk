import { rememberMeCookie } from "./helpers/cookieManagement";
import { Extension } from "./library/Extension";
import { SDK } from "./library/SDK";
import { Event } from "./library/Event";
import { FetchError } from "./library/FetchError";
import { ActionError } from "./library/ActionError";
import { PageError } from "./library/PageError";

const sdk = new SDK();

export {
    sdk,
    SDK,
    Extension,
    Event,
    FetchError,
    ActionError,
    PageError,
    rememberMeCookie
};
