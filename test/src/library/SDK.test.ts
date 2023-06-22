import { expect, test, describe } from "vitest";
import { SDK } from "../../../src/library/SDK";

describe(SDK.name, () => {
	describe("configure", () => {
		test("accepts POSIX locales with currency", () => {
			const sdk = new SDK();
			sdk.configure({
				locale: "ne_NP@NPR",
				currency: "EUR",
				useCurrencyInLocale: true,
				endpoint: "url",
			});

			expect(sdk.locale).toBe("ne-NP");
			expect(sdk.currency).toBe("EUR");
			expect(sdk.posixLocale).toBe("ne_NP@EUR");
		});

		test("accepts POSIX locales without currency", () => {
			const sdk = new SDK();
			sdk.configure({
				locale: "ne_NP",
				currency: "NPR",
				useCurrencyInLocale: true,
				endpoint: "url",
			});

			expect(sdk.locale).toBe("ne-NP");
			expect(sdk.currency).toBe("NPR");
			expect(sdk.posixLocale).toBe("ne_NP@NPR");
		});

		test("accepts BCP-47 locales", () => {
			const sdk = new SDK();

			sdk.configure({
				locale: "ar-EG",
				currency: "EUR",
				endpoint: "url",
			});
			expect(sdk.locale).toBe("ar-EG");
			expect(sdk.currency).toBe("EUR");
			expect(sdk.posixLocale).toBe("ar_EG");
		});
	});
});
