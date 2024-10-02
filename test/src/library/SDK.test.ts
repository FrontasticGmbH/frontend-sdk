import { expect, test, describe, vi, beforeAll, afterAll } from "vitest";
import {
	defaultJsonRedactionText,
	defaultUrlRedactionText,
} from "../../../src/constants/defaultRedactionRules";
import { RedactionHandler } from "../../../src/library/RedactionHandler";
import { SDK } from "../../../src/library/SDK";
import { RedactionManagerConfig } from "../../../src/types/redactionHandling/RedactionManagerConfig";
import { mockDataResponse } from "../../setupConsts";

describe(SDK.name, () => {
	describe("configure", () => {
		describe("locale", () => {
			const privateBackendLocalePropName = "apiHubLocale";

			test("accepts 5 digit locales split by _ or -", () => {
				const sdk = new SDK();

				sdk.configure({
					locale: "ar-EG",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
				});
				expect(sdk.locale()).toBe("ar-EG");
				expect(sdk[privateBackendLocalePropName]()).toBe("ar_EG");

				sdk.configure({
					locale: "ar_EG",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
				});
				expect(sdk.locale()).toBe("ar-EG");
				expect(sdk[privateBackendLocalePropName]()).toBe("ar_EG");
			});

			test("accepts 5 digit locales split by _ or - with currency", () => {
				const sdk = new SDK();

				sdk.configure({
					locale: "ar-EG",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
					useCurrencyInLocale: true,
				});
				expect(sdk.locale()).toBe("ar-EG");
				expect(sdk[privateBackendLocalePropName]()).toBe("ar_EG@EUR");

				sdk.configure({
					locale: "ar_EG",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
					useCurrencyInLocale: true,
				});
				expect(sdk.locale()).toBe("ar-EG");
				expect(sdk[privateBackendLocalePropName]()).toBe("ar_EG@EUR");
			});

			test("accepts 6 digit locales split by _ or -", () => {
				const sdk = new SDK();

				sdk.configure({
					locale: "es-419",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
				});
				expect(sdk.locale()).toBe("es-419");
				expect(sdk[privateBackendLocalePropName]()).toBe("es_419");

				sdk.configure({
					locale: "es_419",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
				});
				expect(sdk.locale()).toBe("es-419");
				expect(sdk[privateBackendLocalePropName]()).toBe("es_419");
			});

			test("accepts 6 digit locales split by _ or - with currency", () => {
				const sdk = new SDK();

				sdk.configure({
					locale: "es-419@EUR",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
					useCurrencyInLocale: true,
				});
				expect(sdk.locale()).toBe("es-419");
				expect(sdk.currency()).toBe("EUR");
				expect(sdk[privateBackendLocalePropName]()).toBe("es_419@EUR");

				sdk.configure({
					locale: "es_419@EUR",
					currency: "EUR",
					endpoint: "url",
					extensionVersion: "dev",
					useCurrencyInLocale: true,
				});
				expect(sdk.locale()).toBe("es-419");
				expect(sdk.currency()).toBe("EUR");
				expect(sdk[privateBackendLocalePropName]()).toBe("es_419@EUR");
			});
		});

		describe("redactionHandlingOverride", () => {
			test("by default redacts properties in events, using password as an example", () => {
				const actionName = "test/myTest";
				const payload = {
					someProp: {
						tonotredact: "To not Redact",
						password: "To Redact",
					},
				};
				const query = {
					Password: "To Redact",
					tonotredact: "To not Redact",
				};
				const endpoint = "https://web.com/frontastic";
				const sdk = new SDK();

				sdk.configure({
					endpoint: endpoint,
					// @ts-expect-error
					currency: "",
					locale: "",
					extensionVersion: "",
				});

				sdk.callAction({
					actionName,
					payload,
					query,
				});

				const expectedUrl = `${endpoint}/action/test/myTest?Password=${defaultUrlRedactionText}&tonotredact=To+not+Redact`;

				sdk.on("fetchCalled", (event) => {
					expect(
						//@ts-expect-error
						event.data.parameters.body.someProp.tonotredact
					).toBe(payload.someProp.tonotredact);
					//@ts-expect-error
					expect(event.data.parameters.body.someProp.password).toBe(
						defaultJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.parameters.query.Password).toBe(
						defaultJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.parameters.query.tonotredact).toBe(
						query.tonotredact
					);
					expect(event.data.url).toBe(expectedUrl);
				});

				sdk.on("fetchSuccessful", (event) => {
					expect(
						//@ts-expect-error
						event.data.parameters.body.someProp.tonotredact
					).toBe(payload.someProp.tonotredact);
					//@ts-expect-error
					expect(event.data.parameters.body.someProp.password).toBe(
						defaultJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.parameters.query.Password).toBe(
						defaultJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.parameters.query.tonotredact).toBe(
						query.tonotredact
					);
					//@ts-expect-error
					expect(event.data.dataResponse.resp.password).toBe(
						defaultJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.dataResponse.resp.toCustomRedact).toBe(
						mockDataResponse.resp.toCustomRedact
					);
					expect(event.data.url).toBe(expectedUrl);
				});
			});

			test("when passed RedactionManagerConfig, overrides default behaviour and redacts as specified in events", async () => {
				const customJsonRedactionText = "[CustomJsonRedactionText]";
				const customUrlRedactionText = "CustomUrlRedactionText";
				const customConfig: RedactionManagerConfig = {
					includes: [
						{ value: "tocustomredact", caseSensitive: false },
					],
					jsonRedactionText: customJsonRedactionText,
					urlRedactionText: customUrlRedactionText,
				};

				const actionName = "test/myTest";
				const payload = {
					someProp: {
						tocustomredact: "To Redact",
						password: "Not redacted",
					},
				};
				const query = {
					password: "Not redacted",
					tocustomredact: "To redact",
				};
				const endpoint = "https://web.com/frontastic";
				const sdk = new SDK();

				sdk.configure({
					endpoint: endpoint,
					// @ts-expect-error
					currency: "",
					locale: "",
					extensionVersion: "",
					redactionHandlingOverride: customConfig,
				});

				sdk.callAction({
					actionName,
					payload,
					query,
				});

				const expectedUrl = `${endpoint}/action/test/myTest?password=Not+redacted&tocustomredact=${customUrlRedactionText}`;

				sdk.on("fetchCalled", (event) => {
					expect(
						//@ts-expect-error
						event.data.parameters.body.someProp.tocustomredact
					).toBe(customJsonRedactionText);
					//@ts-expect-error
					expect(event.data.parameters.body.someProp.password).toBe(
						payload.someProp.password
					);
					//@ts-expect-error
					expect(event.data.parameters.query.password).toBe(
						query.password
					);
					//@ts-expect-error
					expect(event.data.parameters.query.tocustomredact).toBe(
						customJsonRedactionText
					);
					expect(event.data.url).toBe(expectedUrl);
				});

				sdk.on("fetchSuccessful", (event) => {
					expect(
						//@ts-expect-error
						event.data.parameters.body.someProp.tocustomredact
					).toBe(customJsonRedactionText);
					//@ts-expect-error
					expect(event.data.parameters.body.someProp.password).toBe(
						payload.someProp.password
					);
					//@ts-expect-error
					expect(event.data.parameters.query.password).toBe(
						query.password
					);
					//@ts-expect-error
					expect(event.data.parameters.query.tocustomredact).toBe(
						customJsonRedactionText
					);
					//@ts-expect-error
					expect(event.data.dataResponse.resp.password).toBe(
						mockDataResponse.resp.password
					);
					//@ts-expect-error
					expect(event.data.dataResponse.resp.toCustomRedact).toBe(
						customJsonRedactionText
					);
					expect(event.data.url).toBe(expectedUrl);
				});
			});

			test(`when passed RedactionManager implementation, replaces default ${RedactionHandler.name} altogether`, async () => {
				const sdk = new SDK();
				let redactOverriden = false;
				let redactUrlOverriden = false;

				sdk.configure({
					endpoint: "",
					// @ts-expect-error
					currency: "",
					locale: "",
					extensionVersion: "",
					redactionHandlingOverride: {
						// @ts-expect-error
						redact: <T>(data: T) => {
							redactOverriden = true;
							return data;
						},
						redactUrl: (url: string) => {
							redactUrlOverriden = true;
							return url;
						},
					},
				});

				await sdk.callAction({ actionName: "" });

				expect(redactOverriden).toBe(true);
				expect(redactUrlOverriden).toBe(true);
			});
		});
	});
});
