import { RedactionHandler } from "../../library/RedactionHandler";
import {
	defaultJsonRedactionText,
	defaultUrlRedactionText,
} from "../../constants/defaultRedactionRules";
import { RedactionRule } from "./RedactionRule";

/**
 * The configuration object to be passed to the default {@link RedactionHandler}.
 */
interface RedactionManagerConfig {
	/**
	 * An optional array of explicit object paths to properties to redact. For example "account.users.token".
	 */
	paths?: RedactionRule[];
	/**
	 * An optional array of property names to redact at any object depth. For example "token".
	 */
	properties?: RedactionRule[];
	/**
	 * An optional array of explicit object paths to properties to retain, overriding all other rules. For example "account.users.passwordHint".
	 */
	whitelistPaths?: RedactionRule[];
	/**
	 *  An optional array of strings, all properties containing these strings will be redacted. For example, "password" would redact "password", "oldPassword" if case-insensitive etc...
	 */
	includes?: RedactionRule[];
	/**
	 * A string in which to replace redacted properties in JSON objects, default of {@link defaultJsonRedactionText}
	 */
	jsonRedactionText?: string;
	/**
	 * A string in which to replace redacted properties in url queries, default of {@link defaultUrlRedactionText}
	 */
	urlRedactionText?: string;
}

export { RedactionRule, RedactionManagerConfig };
