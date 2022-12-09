import { rememberMeCookie } from "./helpers/cookieManagement";
import { Extension } from "./library/Extension";
import { SDK } from "./library/SDK";
import Event from "./library/Event";
import { FetchError } from "./library/FetchError";
import { ActionResponse } from "./library/types";

const sdk = new SDK();

export {
    sdk,
    SDK,
    Extension,
    Event,
    FetchError,
    ActionResponse as ActionReponse,
    rememberMeCookie
};
