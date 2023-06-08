import { describe, expect, it, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import { fetch } from "cross-fetch";
import * as cookieHandling from "../../../src/cookieHandling";

const mockFetch = vi.fn((url) => {
	const response = new Response();
	response.headers.append("Content-Type", "application/json");
	return response;
});
vi.mock("../../../src/helpers/cookieManagement", () => ({
	rememberMeCookie: {
		get: vi.fn(() => false),
	},
}));
vi.spyOn(cookieHandling, "setCookie");

describe("Fetcher Tests", () => {
	test("should testFetch with sessionLifeTime", async () => {
		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			30000
		);
		expect(cookieHandling.setCookie).toHaveBeenCalled();
	});
});
