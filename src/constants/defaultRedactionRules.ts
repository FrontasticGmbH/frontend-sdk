import { RedactionManagerConfig } from "../types/redactionHandling/RedactionManagerConfig";

const defaultJsonRedactionText = "[REDACTED]";
const defaultUrlRedactionText = "REDACTED";

const defaultRedactionRules: RedactionManagerConfig = {
	includes: [{ value: "password" }],
	properties: [
		{ value: "token" },
		{ value: "accessToken" },
		{ value: "apiToken" },
		{ value: "previewToken" },
		{ value: "apiKey" },
		{ value: "apiSecret" },
		{ value: "clientId" },
		{ value: "clientSecret" },
		{ value: "secret" },
		{ value: "metaData" },
	],
	jsonRedactionText: defaultJsonRedactionText,
	urlRedactionText: defaultUrlRedactionText,
};

export {
	defaultRedactionRules,
	defaultJsonRedactionText,
	defaultUrlRedactionText,
};
