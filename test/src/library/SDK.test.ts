import { expect, test, describe } from "vitest";
import { SDK } from "../../../src/library/SDK";

describe(SDK.name, () => {
	describe("configure", () => {
		const privateBackendLocalePropName = "apiHubLocale";

		test("accepts 5 digit locales split by _ or -", () => {
			const sdk = new SDK();

			sdk.configure({
				locale: "ar-EG",
				currency: "EUR",
				endpoint: "url",
			});
			expect(sdk.locale).toBe("ar-EG");
			expect(sdk[privateBackendLocalePropName]).toBe("ar_EG");

			sdk.configure({
				locale: "ar_EG",
				currency: "EUR",
				endpoint: "url",
			});
			expect(sdk.locale).toBe("ar-EG");
			expect(sdk[privateBackendLocalePropName]).toBe("ar_EG");
		});

		test("accepts 5 digit locales split by _ or - with currency", () => {
			const sdk = new SDK();

			sdk.configure({
				locale: "ar-EG",
				currency: "EUR",
				endpoint: "url",
				useCurrencyInLocale: true,
			});
			expect(sdk.locale).toBe("ar-EG");
			expect(sdk[privateBackendLocalePropName]).toBe("ar_EG@EUR");

			sdk.configure({
				locale: "ar_EG",
				currency: "EUR",
				endpoint: "url",
				useCurrencyInLocale: true,
			});
			expect(sdk.locale).toBe("ar-EG");
			expect(sdk[privateBackendLocalePropName]).toBe("ar_EG@EUR");
		});

		test("accepts 6 digit locales split by _ or -", () => {
			const sdk = new SDK();

			sdk.configure({
				locale: "es-419",
				currency: "EUR",
				endpoint: "url",
			});
			expect(sdk.locale).toBe("es-419");
			expect(sdk[privateBackendLocalePropName]).toBe("es_419");

			sdk.configure({
				locale: "es_419",
				currency: "EUR",
				endpoint: "url",
			});
			expect(sdk.locale).toBe("es-419");
			expect(sdk[privateBackendLocalePropName]).toBe("es_419");
		});

		test("accepts 6 digit locales split by _ or - with currency", () => {
			const sdk = new SDK();

			sdk.configure({
				locale: "es-419@EUR",
				currency: "EUR",
				endpoint: "url",
				useCurrencyInLocale: true,
			});
			expect(sdk.locale).toBe("es-419");
			expect(sdk.currency).toBe("EUR");
			expect(sdk[privateBackendLocalePropName]).toBe("es_419@EUR");

			sdk.configure({
				locale: "es_419@EUR",
				currency: "EUR",
				endpoint: "url",
				useCurrencyInLocale: true,
			});
			expect(sdk.locale).toBe("es-419");
			expect(sdk.currency).toBe("EUR");
			expect(sdk[privateBackendLocalePropName]).toBe("es_419@EUR");
		});
	});
});
