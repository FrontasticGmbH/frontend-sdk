import { expect, test, describe } from "vitest";
import { normaliseUrl } from "../../../src/helpers/urlHelpers";

describe("urlHelpers", () => {
	describe("normaliseUrl", () => {
		test("doesn't error on improper URL", () => {
			expect(() => normaliseUrl("whoops")).not.toThrowError();
		});

		test("preserves protocol at the start of the URL", () => {
			const test = "http://test.com/sub?query=myQuery";
			const test2 = "https://test.com/sub?query=myQuery";
			const test3 = "ws://test.com/sub?query=myQuery";
			const test4 = "wss://test.com/sub?query=myQuery";
			const test5 = "test.com/sub?query=myQuery";

			expect(normaliseUrl(test)).toBe(test);
			expect(normaliseUrl(test2)).toBe(test2);
			expect(normaliseUrl(test3)).toBe(test3);
			expect(normaliseUrl(test4)).toBe(test4);
			expect(normaliseUrl(test5)).toBe(test5);
		});

		test("removes unwanted slashes", () => {
			const testUrl1 = "http://domain/page//secondpage";
			const expectedUrl1 = "http://domain/page/secondpage";
			const testUrl2 = "http://domain/page//secondpage?param=true";
			const expectedUrl2 = "http://domain/page/secondpage?param=true";
			const testUrl3 = "http://domain/page//secondpage/?param=true";
			const expectedUrl3 = "http://domain/page/secondpage?param=true";

			expect(normaliseUrl(testUrl1)).toBe(expectedUrl1);
			expect(normaliseUrl(testUrl2)).toBe(expectedUrl2);
			expect(normaliseUrl(testUrl3)).toBe(expectedUrl3);
		});

		test("doesn't replace the host when another url is part of the url", () => {
			const url =
				"https://domain.frontastic.rocks/path?param=https://attacker.example";
			const url2 =
				"https://domain.frontastic.rocks/path?param=https://attacker.example?query=true";
			const url3 =
				"domain.frontastic.rocks/path?param=https://attacker.example?query=true";

			expect(normaliseUrl(url)).toBe(url);
			expect(normaliseUrl(url2)).toBe(url2);
			expect(normaliseUrl(url3)).toBe(url3);
		});
	});
});
