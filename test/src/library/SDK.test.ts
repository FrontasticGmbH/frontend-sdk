import { expect, test, describe, vi, beforeAll, afterAll, beforeEach } from "vitest";
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

				// Register an event handler to trigger redaction (redaction only runs when events are triggered)
				sdk.on("actionCalled", () => {});

				await sdk.callAction({ actionName: "" });

				expect(redactOverriden).toBe(true);
				expect(redactUrlOverriden).toBe(true);
			});

			test("does not mutate the original dataResponse when event handlers are registered", async () => {
				const sdk = new SDK();
				const originalToken = "5a4f5e7a-2d45-4599-8fd0-7c729279ff7c";

				// Create a mock response with a token that would normally be redacted
				const mockResponse = {
					token: originalToken,
					password: "secret123",
					data: {
						nested: {
							token: originalToken,
						},
					},
				};

				// Store the original values to compare later
				const originalMockResponse = JSON.parse(JSON.stringify(mockResponse));

				sdk.configure({
					endpoint: "https://example.com",
					// @ts-expect-error
					currency: "",
					locale: "",
					extensionVersion: "",
				});

				// Register event handlers (this triggers redaction)
				let eventDataResponse: any;
				sdk.on("fetchSuccessful", (event) => {
					// @ts-expect-error
					eventDataResponse = event.data.dataResponse;
				});

				// Mock fetch to return our response
				const originalFetch = global.fetch;
				global.fetch = vi.fn().mockResolvedValue({
					ok: true,
					status: 200,
					statusText: "OK",
					headers: new Map([
						["Content-Type", "application/json"],
						["Frontastic-Session", "SESSION"],
					]),
					json: () => Promise.resolve(mockResponse),
				});

				try {
					const result = await sdk.callAction({ actionName: "test/action" });

					// The event data should have redacted values
					expect(eventDataResponse.token).toBe(defaultJsonRedactionText);
					expect(eventDataResponse.password).toBe(defaultJsonRedactionText);

					// CRITICAL: The original mockResponse should NOT be mutated
					// This was the bug - redaction was mutating the original response
					expect(mockResponse.token).toBe(originalToken);
					expect(mockResponse.password).toBe("secret123");
					expect(mockResponse.data.nested.token).toBe(originalToken);

					// Verify the entire original object is unchanged
					expect(mockResponse).toEqual(originalMockResponse);
				} finally {
					global.fetch = originalFetch;
				}
			});
		});
	});

	describe("invalidateSession", () => {
		test("throws error if SDK is not configured", async () => {
			const sdk = new SDK();

			await expect(sdk.invalidateSession()).rejects.toThrow();
		});

		test("completes successfully when configured", async () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			// Should not throw
			await expect(sdk.invalidateSession()).resolves.not.toThrow();
		});

		test("can skip waiting for pending requests", async () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			const start = Date.now();
			await sdk.invalidateSession({ waitForPending: false });
			const elapsed = Date.now() - start;

			// Should complete almost immediately
			expect(elapsed).toBeLessThan(100);
		});

		test("respects timeout option", async () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			const start = Date.now();
			await sdk.invalidateSession({ timeoutMs: 50 });
			const elapsed = Date.now() - start;

			// Should complete within reasonable time of timeout
			expect(elapsed).toBeLessThan(200);
		});
	});

	describe("hasEventHandlers", () => {
		test("returns false when no handlers registered", () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			expect(sdk.hasEventHandlers("fetchCalled")).toBe(false);
			expect(sdk.hasEventHandlers("actionCalled")).toBe(false);
		});

		test("returns true when handler is registered", () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			sdk.on("fetchCalled", () => {});

			expect(sdk.hasEventHandlers("fetchCalled")).toBe(true);
			expect(sdk.hasEventHandlers("actionCalled")).toBe(false);
		});

		test("returns false after handler is removed", () => {
			const sdk = new SDK();

			sdk.configure({
				endpoint: "https://example.com",
				// @ts-expect-error
				currency: "",
				locale: "",
				extensionVersion: "",
			});

			const handler = () => {};
			sdk.on("fetchCalled", handler);
			expect(sdk.hasEventHandlers("fetchCalled")).toBe(true);

			sdk.off("fetchCalled", handler);
			expect(sdk.hasEventHandlers("fetchCalled")).toBe(false);
		});
	});
});
