import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import * as cookieHandling from "../../../src/cookieHandling";

describe("Testing Fetch Functionality for rememberMe cooking handling", () => {
	let mockedTimestamp;

	beforeAll(() => {
		mockedTimestamp = 1673673600000;
		vi.spyOn(Date, "now").mockImplementation(() => mockedTimestamp);
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	test("fetcher should set sessionLifetime when rememberMe is set to true with given param[sessionLifetime]", async () => {
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
			sessionLifetime,
			{}
		);
		expect(cookieHandling.setCookie).toHaveBeenCalled();
		const newSessionLife = new Date(Date.now() + sessionLifetime);
		expect(cookieHandling.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: newSessionLife,
			}
		);
	});

	test("fetcher should not set sessionLifetime when rememberMe is set to false", async () => {
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
			890000000,
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
