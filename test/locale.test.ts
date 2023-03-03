import { expect, test } from "vitest";
import { SDK } from "../src";

test("accepts POSIX locales with currency", () => {
	const sdk = new SDK();
	sdk.configure({ locale: "ne_NP@NPR", useCurrencyInLocale: true, endpoint: "url" });

	expect(sdk.locale).toBe("ne-NP");
	expect(sdk.currency).toBe("NPR");
	expect(sdk.APILocale).toBe("ne_NP@NPR");
});

test("accepts POSIX locales without currency", () => {
	const sdk = new SDK();
	sdk.configure({ locale: "ne_NP", currency: "NPR", useCurrencyInLocale: true, endpoint: "url" });

	expect(sdk.locale).toBe("ne-NP");
	expect(sdk.currency).toBe("NPR");
	expect(sdk.APILocale).toBe("ne_NP@NPR");
});

test("accepts BCP-47 locales", () => {
	const sdk = new SDK();

	sdk.configure({ locale: "ar-EG", currency: "EUR", endpoint: "url" });
	expect(sdk.locale).toBe("ar-EG");
	expect(sdk.currency).toBe("EUR");
  expect(sdk.APILocale).toBe("ar_EG")
  expect(sdk.posixLocale).toBe("ar_EG")

});

test("should throw error if no currency is provided", () => {
	const sdk = new SDK();
	expect(() => sdk.configure({ locale: "ar_EG", endpoint: "url" })).toThrowError()
})
