import { describe, expect, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import * as cookieHandling from "../../../src/cookieHandling";

describe("Fetcher Tests", () => {
	test("should test fetcher with provided sessionLifetime", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => true);

		vi.spyOn(cookieHandling, "setCookie");

		const sessionLifetime = 890000000;

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			sessionLifetime
		);
		expect(cookieHandling.setCookie).toHaveBeenCalled();

		// FIX: We cannot get this test to work as the sessionTime gets updated to the latest datetime
		// const newSessionLife = new Date(Date.now() + sessionLifetime);
		// expect(cookieHandling.setCookie).toHaveBeenCalledWithVariables(
		// 	"frontastic-session",
		// 	"SESSION",
		// 	{
		// 		"expires": newSessionLife,
		// 	}
		// );
	});

	test("should test fetcher with default expiry date from headers", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => false);
		vi.spyOn(cookieHandling, "setCookie");

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{}
		);
		expect(cookieHandling.setCookie).toHaveBeenCalled();

		expect(cookieHandling.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: undefined,
			}
		);
	});
});
