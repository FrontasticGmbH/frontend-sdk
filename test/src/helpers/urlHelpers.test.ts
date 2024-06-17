import { expect, test, describe } from "vitest";
import {
	generateQueryString,
	normaliseUrl,
} from "../../../src/helpers/urlHelpers";

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

	describe("generateQueryString", () => {
		test("serialises string types into query correctly", () => {
			const query = {
				val1: "test, [1]",
				val2: "|\\,./<>?;'#:@~[]{}-=_+¬`!\"£$%^&*()_+",
			};
			const expectedQueryString =
				"?val1=test%2C+%5B1%5D&val2=%7C%5C%2C.%2F%3C%3E%3F%3B%27%23%3A%40%7E%5B%5D%7B%7D" +
				"-%3D_%2B%C2%AC%60%21%22%C2%A3%24%25%5E%26*%28%29_%2B";
			const queryString = generateQueryString(query);

			expect(queryString).toBe(expectedQueryString);
		});

		test("serialises number types into query correctly", () => {
			const query = {
				val1: 1243567890,
				val2: 345.4334,
			};
			const expectedQueryString = "?val1=1243567890&val2=345.4334";
			const queryString = generateQueryString(query);

			expect(queryString).toBe(expectedQueryString);
		});

		test("serialises boolean types into query correctly", () => {
			const query = {
				val1: true,
				val2: false,
			};
			const expectedQueryString = "?val1=true&val2=false";
			const queryString = generateQueryString(query);

			expect(queryString).toBe(expectedQueryString);
		});

		test("serialises array types into query correctly", () => {
			const query = {
				stringArray: ["string 1", "string 2, with comma", "string 3"],
				singleStringArray: ["string 1"],
				singleStringArrayWithComma: ["str,ing"],
				numberArray: [43504, 345],
				boolArray: [true, true, false, true],
			};
			const expectedQueryString =
				"?stringArray[]=string+1&stringArray[]=string+2%2C+with+comma&stringArray[]" +
				"=string+3&singleStringArray[]=string+1&singleStringArrayWithComma[]=str%2Ci" +
				"ng&numberArray[]=43504&numberArray[]=345&boolArray[]=true&boolArray[]=true&" +
				"boolArray[]=false&boolArray[]=true";
			const queryString = generateQueryString(query);

			expect(queryString).toBe(expectedQueryString);
		});
	});
});
